# Import
{expect} = require('chai')
joe = require('joe')

# Test
joe.suite 'getrepos', (suite,test) ->
	getter = null

	# Create our contributors instance
	test 'create', ->
		getter = require('../../').create(
			#log: console.log
		)

	# Fetch all the contributors on these github
	suite 'repo', (suite,test) ->
		test 'fetch', (done) ->
			getter.fetchRepos ['bevry/getcontributors','bevry/docpad'], (err,result) ->
				expect(err).to.be.null
				expect(result).to.be.an('array')
				expect(result.length).to.not.equal(0)
				return done()

		test 'combined result', ->
			result = getter.getRepos()
			expect(result).to.be.an('array')
			expect(result.length).to.not.equal(0)

	# Fetch all the contributors on these github users/organisations
	suite 'users', (suite,test) ->
		test 'fetch', (done) ->
			getter.fetchReposFromUsers ['docpad'], (err,result) ->
				expect(err).to.be.null
				expect(result).to.be.an('array')
				expect(result.length).to.not.equal(0)
				return done()

		test 'combined result', ->
			result = getter.getRepos()
			expect(result).to.be.an('array')
			expect(result.length).to.not.equal(0)
