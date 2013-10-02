# Import
extendr = require('extendr')
typeChecker = require('typechecker')

# Getter
class Getter
	# Repos
	# Object listing of all the repos, indexed by their fullname
	reposMap: null  # {}

	# Config
	config: null  # {}

	# Constructor
	# Create a new contributors instance
	# opts={githubClientId, githubClientSecret} - also forwarded onto feedr
	constructor: (opts={}) ->
		# Prepare
		@config = {}
		@reposMap = {}

		# Extend configuration
		extendr.extend(@config, opts)

		# Try env for github credentials
		@config.githubClientId ?= process.env.GITHUB_CLIENT_ID or null
		@config.githubClientSecret ?= process.env.GITHUB_CLIENT_SECRET or null

		# Feedr
		@feedr = new (require('feedr').Feedr)(@config)

		# Chain
		@

	# Log
	log: (args...) ->
		@config.log?(args...)
		@

	# Add a repo to the internal listing and finish preparing it
	# repo = {}
	# return {}
	addRepo: (repo) ->
		# Log
		@log 'debug', 'Adding the repo:', repo

		# Update references in database
		@reposMap[repo.full_name] ?= repo

		# Return
		return @reposMap[repo.full_name]

	# Get the repos
	# return []
	getRepos: (repos) ->
		# Log
		@log 'debug', 'Get repos'

		# Prepare
		comparator = (a,b) ->
			A = a.name.toLowerCase()
			B = b.name.toLowerCase()
			if A is B
				0
			else if A < B
				-1
			else
				1

		# Allow the user to pass in their own array or object
		if repos? is false
			repos = @reposMap
		else
			# Remove duplicates from array
			if typeChecker.isArray(repos) is true
				exists = {}
				repos = repos.filter (repo) ->
					exists[repo.full_name] ?= 0
					++exists[repo.full_name]
					return exists[repo.full_name] is 1

		# Convert objects to arrays
		if typeChecker.isPlainObject(repos) is true
			repos = Object.keys(repos).map((key) => repos[key])

		# Prepare the result
		repos = repos.sort(comparator)

		# Return
		return repos

	# Fetch Repos From Users
	# repos=["bevry"]
	# next(err)
	# return @
	fetchReposFromUsers: (users,next) ->
		# Log
		@log 'debug', 'Get repos from users:', users

		# Prepare
		query = users.map((name)->'@'+name).join('%20')

		# Forward
		return @fetchReposFromSearch(query, next)

	# Fetch Repos
	# repos=["bevry/getcontributors"]
	# next(err)
	# return @
	fetchRepos: (repos,next) ->
		# Log
		@log 'debug', 'Get repos:', repos

		# Prepare
		query = repos.map((name)->'@'+name).join('%20')

		# Forward
		return @fetchReposFromSearch(query, next)

	# Fetch Repos From Search
	# query="@bevry/getcontributors @bevry/docpad"
	# next(err)
	# return @
	fetchReposFromSearch: (query,next) ->
		# Prepare
		me = @

		# Read the user's repository feeds
		@requestReposFromSearch query, {page:1}, (err,repos) ->
			# Check
			return next(err, [])  if err
			result = me.getRepos(repos)
			return next(null, result)

		# Chain
		@

	# Request Repos From Search
	# query="@bevry/getcontributors @bevry/docpad"
	# next(err)
	# return @
	requestReposFromSearch: (query,opts={},next) ->
		# Prepare
		opts.page ?= 1
		me = @

		# Log
		@log 'debug', 'Requesting repos from search:', query, opts

		# Prepare feed
		feedUrl = "https://api.github.com/search/repositories?page=#{opts.page}&per_page=100&q=#{query}&client_id=#{@config.githubClientId}&client_secret=#{@config.githubClientSecret}"
		feedOptions =
			url: feedUrl
			requestOptions:
				headers:
					Accept: 'application/vnd.github.preview'

		# Read the user's repository feeds
		@feedr.readFeed feedOptions, (err,data) ->
			# Check
			return next(err, [])  if err
			return next(null, [])  unless data?.items?.length

			# Filter out forks, return just their names
			addedRepos = []
			for repo in data.items
				addedRepo = me.addRepo(repo)
				addedRepos.push(addedRepo)  if addedRepo

			# Success
			if data.items.length is 100
				opts.page++
				me.requestReposFromSearch query, opts, (err, moreAddedRepos) ->
					return next(err, [])  if err
					combinedAddedRepos = addedRepos.concat(moreAddedRepos)
					return next(null, combinedAddedRepos)
			else
				return next(null, addedRepos)

		# Chain
		@

# Export
module.exports =
	create: (args...) ->
		return new Getter(args...)
