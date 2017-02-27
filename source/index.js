'use strict'

// Import
const typeChecker = require('typechecker')
const extendr = require('extendr')
const {TaskGroup} = require('taskgroup')

/**
Compare the name param of two objects for sorting in an array
@param {Object} a
@param {Object} b
@return {number} either 0, -1, or 1
@access private
*/
function nameComparator (a, b) {
	const A = a.name.toLowerCase()
	const B = b.name.toLowerCase()
	if ( A === B ) {
		return 0
	}
	else if ( A < B ) {
		return -1
	}
	else {
		return 1
	}
}

/**
Get Repositories Class

A class as it contains a config object, as well as a `reposMap` object.

Configuration details can be found in the constructor definition.

Configuration is also forwarded onto https://github.com/bevry/feedr which we use for fetching data.

@constructor
@class Getter
@access public
*/
class Getter {
	/**
	Creates and returns new instance of the current class.
	@param {...*} args - The arguments to be forwarded along to the constructor.
	@return {Object} The new instance.
	@static
	@access public
	*/
	static create (...args) {
		return new this(...args)
	}

	/**
	Construct our Getter Class
	@param {Object} [opts]
	@param {Function} [opts.log] - defaults to `null`, can be a function that receives the arguments: `logLevel`, `...args`
	@param {string} [opts.githubClientId] - defaults to the environment variable `GITHUB_CLIENT_ID` or `null`
	@param {string} [opts.githubClientSecret] - defaults to environment variable `GITHUB_CLIENT_SECRET` or `null`
	@access public
	*/
	constructor (opts = {}) {
		// Prepare
		this.config = {
			githubClientId: process.env.GITHUB_CLIENT_ID || null,
			githubClientSecret: process.env.GITHUB_CLIENT_SECRET || null
		}
		this.reposMap = {}

		// Extend configuration
		extendr.extend(this.config, opts)

		// Feedr
		this.feedr = require('feedr').create(this.config)

		// Chain
		return this
	}

	/**
	Forward the arguments onto the configured logger if it exists.
	@param {...*} args
	@chainable
	@returns {this}
	@access private
	*/
	log (...args) {
		if ( this.config.log ) {
			this.config.log(...args)
		}
		return this
	}


	// =================================
	// Add

	/**
	Add a repository to the internal listing and finish preparing it
	@param {Repository} [repo]
	@returns {Repository}
	@access private
	*/
	addRepo (repo) {
		// Log
		this.log('debug', 'Adding the repo:', repo)

		// Check
		if ( !repo || !repo.full_name ) {
			return null
		}

		// Update references in database
		if ( this.reposMap[repo.full_name] == null ) {
			this.reposMap[repo.full_name] = repo
		}

		// Return
		return this.reposMap[repo.full_name]
	}


	// =================================
	// Format

	/**
	Prepare a repo for return to the user
	@param {Array} [repos] - array of {Repository}
	@returns {Array} - array of {Repository}
	@access private
	*/
	getRepos (repos) {
		// Log
		this.log('debug', 'Get repos')

		// Allow the user to pass in their own array or object
		if ( repos == null ) {
			repos = this.reposMap
		}

		// Remove duplicates from array
		else if ( typeChecker.isArray(repos) ) {
			const exists = {}
			repos = repos.filter(function (repo) {
				if ( exists[repo.full_name] == null ) {
					exists[repo.full_name] = 0
				}
				++exists[repo.full_name]
				return exists[repo.full_name] === 1
			})
		}

		// Convert objects to arrays
		if ( typeChecker.isPlainObject(repos) ) {
			repos = Object.keys(repos).map((key) => repos[key])
		}

		// Prepare the result
		this.log('debug', `Sorting the ${repos.length} repositories`)
		repos = repos.sort(nameComparator)

		// Return
		return repos
	}


	// =================================
	// Fetch Directly

	/**
	Fetch data for Repositories from Repository Names
	@param {Array} [repoFullNames] - array of {string} repository names, such as `['bevry/getcontributors', 'bevry/getrepos']`
	@param {Function} [next] - completion callback, accepts the arguments:
	@param {Error} [next.error] - if the procedure failed, this is the error instance, otherwise `null`
	@param {Array} [next.result] - if the procedure succeeded, this is the array of repos
	@chainable
	@returns {this}
	@access public
	*/
	fetchRepos (repoFullNames, next) {
		// Log
		this.log('debug', 'Fetch repositories:', repoFullNames)

		// Prepare
		const me = this
		const result = []
		const tasks = TaskGroup.create({concurrency: 0}).done(function (err) {
			if ( err ) {
				return next(err, [])
			}
			return next(null, me.getRepos(result))
		})

		// Add the tasks
		repoFullNames.forEach(function (repoFullName) {
			tasks.addTask(`fetch repo data for ${repoFullName}`, function (complete) {
				me.requestRepo(repoFullName, function (err, repo) {
					if ( err ) {
						return complete(err)
					}
					result.push(repo)
					return complete()
				})
			})
		})

		// Run the tasks
		tasks.run()

		// Chain
		return this
	}

	/**
	Fetch data for Repostiory from Repository Name
	@param {string} [repoFullName] - repostory name, such as `'bevry/getrepos'`
	@param {Function} [next] - completion callback, accepts the arguments:
	@param {Error} [next.error] - if the procedure failed, this is the error instance, otherwise `null`
	@param {Array} [next.result] - if the procedure succeeded, this is the array of repos
	@chainable
	@returns {this}
	@access public
	*/
	requestRepo (repoFullName, next) {
		// Prepare
		const me = this
		const feedOptions = {
			url: `https://api.github.com/repos/${repoFullName}?client_id=${this.config.githubClientId}&client_secret=${this.config.githubClientSecret}`,
			parse: 'json'
		}

		// Read the user's repository feeds
		this.feedr.readFeed(feedOptions, function (err, responseData) {
			// Check
			if ( err ) {
				return next(err, [])
			}
			else if ( responseData.message ) {
				return next(new Error(responseData.message), [])
			}

			else if ( !responseData.full_name ) {
				return next(new Error('response was not a repository'), [])
			}

			// Add
			const addedRepo = me.addRepo(responseData)

			// Return
			return next(null, addedRepo)
		})

		// Chain
		return this
	}


	// =================================
	// Fetch from Search

	/**
	Fetch data for Repostiories from Users
	@param {Array} [users] - users to get repos for, such as `['bevry', 'browserstate']`
	@param {Function} [next] - completion callback, accepts the arguments:
	@param {Error} [next.error] - if the procedure failed, this is the error instance, otherwise `null`
	@param {Array} [next.result] - if the procedure succeeded, this is the array of repos
	@chainable
	@returns {this}
	@access public
	*/
	fetchReposFromUsers (users, next) {
		// Log
		this.log('debug', 'Fetch repos from users:', users)

		// Prepare
		const query = users.map((name) => `@${name}`).join('%20')

		// Forward
		return this.fetchReposFromSearch(query, next)
	}

	/**
	Fetch data for Repostiories from a Search
	@param {string|Array} [query] - search query, such as `@bevry/getcontributors @bevry/getrepos`, can also be array `['bevry/getcontributors', 'bevry/getrepos']`
	@param {Function} [next] - completion callback, accepts the arguments:
	@param {Error} [next.error] - if the procedure failed, this is the error instance, otherwise `null`
	@param {Array} [next.result] - if the procedure succeeded, this is the array of repos
	@chainable
	@returns {this}
	@access public
	*/
	fetchReposFromSearch (query, next) {
		// Prepare
		const me = this

		// Check
		if ( typeChecker.isArray(query) ) {
			query = query.map((name) => `@${name}`).join('%20')
		}

		// Log
		this.log('debug', 'Fetch repositories from search:', query)

		// Read the user's repository feeds
		this.requestReposFromSearch(query, {page: 1}, function (err, repos) {
			if ( err ) {
				return next(err, [])
			}
			const result = me.getRepos(repos)
			return next(null, result)
		})

		// Chain
		return this
	}

	/**
	Fetch data for Repostiories from a Search, will iterate all subsequent pages
	@param {string} [query] - search query, such as `@bevry/getcontributors @bevry/getrepos`
	@param {Object} [opts] - optional params for the search
	@param {number} [opts.page] - the starting page, defaults to 1
	@param {Function} [next] - completion callback, accepts the arguments:
	@param {Error} [next.error] - if the procedure failed, this is the error instance, otherwise `null`
	@param {Array} [next.result] - if the procedure succeeded, this is the array of repos
	@chainable
	@returns {this}
	@access public
	*/
	requestReposFromSearch (query, opts = {}, next) {
		// Prepare
		const me = this
		if ( opts.page == null ) {
			opts.page = 1
		}
		const feedOptions = {
			url: `https://api.github.com/search/repositories?page=${opts.page}&per_page=100&q=${query}&client_id=${this.config.githubClientId}&client_secret=${this.config.githubClientSecret}`,
			parse: 'json',
			requestOptions: {
				headers: {
					Accept: 'application/vnd.github.beta+json'
				}
			}
		}

		// Log
		this.log('debug', 'Requesting repositories from search:', query, opts, feedOptions.url)

		// Read the user's repository feeds
		this.feedr.readFeed(feedOptions, function (err, responseData) {
			// Check
			if ( err ) {
				return next(err, [])
			}
			else if ( responseData.message ) {
				return next(new Error(responseData.message), [])
			}
			else if ( !responseData || !Array.isArray(responseData.items) ) {
				return next(new Error('response was not the format we expected'), [])
			}
			else if ( responseData.items.length === 0 ) {
				return next(null, [])
			}

			// Add
			const addedRepos = []
			responseData.items.forEach(function (repo) {
				const addedRepo = me.addRepo(repo)
				if ( addedRepo ) {
					addedRepos.push(addedRepo)
				}
			})

			// Success
			if ( responseData.items.length === 100 ) {
				// Page
				opts.page += 1
				me.requestReposFromSearch(query, opts, function (err, moreAddedRepos) {
					if ( err ) {
						return next(err, [])
					}
					const combinedAddedRepos = addedRepos.concat(moreAddedRepos)
					return next(null, combinedAddedRepos)
				})
			}
			else {
				// Return
				return next(null, addedRepos)
			}
		})

		// Chain
		return this
	}
}

// Export
module.exports = Getter
