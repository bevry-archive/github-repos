/* eslint no-console:0 */
'use strict'

// Import
const { getType } = require('typechecker')
const { equal, errorEqual } = require('assert-helpers')
const util = require('util')
const kava = require('kava')

// Test
kava.suite('getrepos', function(suite, test) {
	let getter = null

	// Create our instance
	test('create', function() {
		getter = require('../').create({
			log(...args) {
				console.log(
					args
						.map(arg => util.inspect(arg, { colors: true }))
						.join(' ')
						.replace(
							/(client_id|clientid|key|secret)=[a-z0-9]+/gi,
							'$1=SECRET_REMOVED_BY_GETREPOS_CLEAN'
						)
				)
			}
		})
	})

	// Fetch all the contributors on these github
	suite('repo', function(suite, test) {
		test('fetch', function(done) {
			getter.fetchRepos(['bevry/getcontributors', 'bevry/getrepos'], function(
				err,
				result
			) {
				errorEqual(err, null)
				equal(getType(result), 'array', 'result is array')
				equal(
					result.length > 0,
					true,
					`length to be more than 0, it was ${result.length}`
				)
				return done()
			})
		})

		test('combined result', function() {
			const result = getter.getRepos()
			equal(getType(result), 'array', 'result is array')
			equal(
				result.length > 0,
				true,
				`length to be more than 0, it was ${result.length}`
			)
		})
	})

	// Fetch all the contributors on these github users/organisations
	suite('users', function(suite, test) {
		test('fetch', function(done) {
			getter.fetchReposFromUsers(['browserstate'], function(err, result) {
				errorEqual(err, null)
				equal(getType(result), 'array', 'result is array')
				equal(
					result.length > 0,
					true,
					`length to be more than 0, it was ${result.length}`
				)
				return done()
			})
		})

		test('combined result', function() {
			const result = getter.getRepos()
			equal(getType(result), 'array', 'result is array')
			equal(
				result.length > 0,
				true,
				`length to be more than 0, it was ${result.length}`
			)
		})
	})
})
