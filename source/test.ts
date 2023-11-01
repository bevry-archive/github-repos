// Import
import { equal } from 'assert-helpers'
import { getRepos, getReposFromSearch, getReposFromUsers } from './index.js'
import kava from 'kava'

// Test
kava.suite('@bevry/github-repos', function (suite, test) {
	test('repos', function (done) {
		getRepos(['bevry/github-commit', 'bevry/github-repos'])
			.then(function (result) {
				equal(Array.isArray(result), true, 'result is array')
				equal(
					result.length > 0,
					true,
					`length to be more than 0, it was ${result.length}`,
				)
				done()
			})
			.catch(done)
	})

	test('users', function (done) {
		getReposFromUsers(['browserstate'])
			.then(function (result) {
				equal(Array.isArray(result), true, 'result is array')
				equal(
					result.length > 0,
					true,
					`length to be more than 0, it was ${result.length}`,
				)
				done()
			})
			.catch(done)
	})

	test('search', function (done) {
		getReposFromSearch('@bevry language:typescript')
			.then(function (result) {
				equal(Array.isArray(result), true, 'result is array')
				equal(
					result.length > 0,
					true,
					`length to be more than 0, it was ${result.length}`,
				)
				done()
			})
			.catch(done)
	})
})
