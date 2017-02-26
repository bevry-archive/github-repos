# Import
extendr = require('extendr')
typeChecker = require('typechecker')
{TaskGroup} = require('taskgroup')

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


	# =================================
	# Add

	# Add a repo to the internal listing and finish preparing it
	# repo = {}
	# return {}
	addRepo: (repo) ->
		# Log
		@log 'debug', 'Adding the repo:', repo

		# Check
		return null  unless repo?.full_name

		# Update references in database
		@reposMap[repo.full_name] ?= repo

		# Return
		return @reposMap[repo.full_name]


	# =================================
	# Format

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
					return false  unless repo?.full_name
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


	# =================================
	# Individually

	# Fetch Repos
	# repoFullNames=["bevry/getcontributors"]
	# next(err)
	# return @
	fetchRepos: (repoFullNames,next) ->
		# Prepare
		me = @

		# Log
		@log 'debug', 'Fetch repos:', repos

		# Split it up, github search only supports 79 repos per search it seems...
		# we thought it was due to url length but that doesn't seem to be the case
		# 1732 url with 80 repos fails, 1732 url with 79 repos passes
		repos = []
		tasks = new TaskGroup(concurrency:0).done (err) ->
			# Check
			return next(err, [])  if err
			result = me.getRepos(repos)
			return next(null, result)

		# Add the tasks
		repoFullNames.forEach (repoFullName) ->  tasks.addTask (complete) ->
			me.requestRepo repoFullName, {}, (err,repo) ->
				return complete(err)  if err
				repos.push(repo)  if repo
				return complete()

		# Run the tasks
		tasks.run()

		# Chain
		@

	# Request Repo
	# repoFullName="bevry/getcontributors"
	# next(err)
	# return @
	requestRepo: (repoFullName,opts={},next) ->
		# Prepare
		me = @

		# Prepare feed
		feedUrl = "https://api.github.com/repos/#{repoFullName}?client_id=#{@config.githubClientId}&client_secret=#{@config.githubClientSecret}"
		feedOptions =
			url: feedUrl
			parse: 'json'

		# Log
		@log 'debug', 'Requesting repo:', repoFullName, opts, feedUrl

		# Read the user's repository feeds
		@feedr.readFeed feedOptions, (err,repo) ->
			# Check
			return next(err, {})  if err

			# Add
			addedRepo = me.addRepo(repo)

			# Return
			return next(null, addedRepo)

		# Chain
		@


	# =================================
	# Search

	# Fetch Repos From Users
	# users=["bevry"]
	# next(err)
	# return @
	fetchReposFromUsers: (users,next) ->
		# Log
		@log 'debug', 'Fetch repos from users:', users

		# Prepare
		query = users.map((name)->'@'+name).join('%20')

		# Forward
		return @fetchReposFromSearch(query, next)

	# Fetch Repos From Search
	# query="@bevry/getcontributors @bevry/docpad"
	# next(err)
	# return @
	fetchReposFromSearch: (query,next) ->
		# Prepare
		me = @

		# Check
		if typeChecker.isArray(query)
			query = query.map((name)->'@'+name).join('%20')

		# Log
		@log 'debug', 'Fetch repos from search:', query

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

		# Prepare feed
		feedUrl = "https://api.github.com/search/repositories?page=#{opts.page}&per_page=100&q=#{query}&client_id=#{@config.githubClientId}&client_secret=#{@config.githubClientSecret}"
		feedOptions =
			url: feedUrl
			parse: 'json'
			requestOptions:
				headers:
					Accept: 'application/vnd.github.beta+json'

		# Log
		@log 'debug', 'Requesting repos from search:', query, opts, feedUrl

		# Read the user's repository feeds
		@feedr.readFeed feedOptions, (err,data) ->
			# Check
			return next(err, [])  if err
			return next(null, [])  unless data?.items?.length

			# Add
			addedRepos = []
			for repo in data.items
				addedRepo = me.addRepo(repo)
				addedRepos.push(addedRepo)  if addedRepo

			# Success
			if data.items.length is 100
				# Page
				opts.page++
				me.requestReposFromSearch query, opts, (err, moreAddedRepos) ->
					return next(err, [])  if err
					combinedAddedRepos = addedRepos.concat(moreAddedRepos)
					return next(null, combinedAddedRepos)
			else
				# Return
				return next(null, addedRepos)

		# Chain
		@

# Export
module.exports =
	create: (args...) ->
		return new Getter(args...)
