/* eslint no-console:0 */
'use strict'

// Import
const {getType} = require('typechecker')
const {equal, errorEqual} = require('assert-helpers')
const joe = require('joe')

// Test
joe.suite('getrepos', function (suite, test) {
	let getter = null

	// Create our instance
	test('create', function () {
		getter = require('../').create({
			log: console.log
		})
	})

	// Fetch all the contributors on these github
	suite('repo', function (suite, test) {
		test('fetch', function (done) {
			getter.fetchRepos(['bevry/getcontributors', 'bevry/getrepos'], function (err, result) {
				errorEqual(err, null)
				equal(getType(result), 'array', 'result is array')
				equal(result.length > 0, true, `length to be more than 0, it was ${result.length}`)
				return done()
			})
		})

		test('combined result', function () {
			const result = getter.getRepos()
			equal(getType(result), 'array', 'result is array')
			equal(result.length > 0, true, `length to be more than 0, it was ${result.length}`)
		})
	})

	// Fetch all the contributors on these github users/organisations
	suite('users', function (suite, test) {
		test('fetch', function (done) {
			getter.fetchReposFromUsers(['browserstate'], function (err, result) {
				errorEqual(err, null)
				equal(getType(result), 'array', 'result is array')
				equal(result.length > 0, true, `length to be more than 0, it was ${result.length}`)
				return done()
			})
		})

		test('combined result', function () {
			const result = getter.getRepos()
			equal(getType(result), 'array', 'result is array')
			equal(result.length > 0, true, `length to be more than 0, it was ${result.length}`)
		})
	})
})
