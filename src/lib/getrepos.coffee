# Import
extendr = require('extendr')

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
	getRepos: ->
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

		# Fetch prepared repos and sort them
		repos = Object.keys(@reposMap).map((key) => @reposMap[key]).sort(comparator)

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
		# Log
		@log 'debug', 'Get repos from search:', query

		# Prepare
		me = @
		feedUrl = "https://api.github.com/search/repositories?per_page=100&q=#{query}&client_id=#{@config.githubClientId}&client_secret=#{@config.githubClientSecret}"
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

			# Success, exit with the repos
			return next(null, addedRepos)

		# Chain
		@

# Export
module.exports =
	create: (args...) ->
		return new Getter(args...)
