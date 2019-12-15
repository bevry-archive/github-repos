// Import
import fetch from 'cross-fetch'
import githubAuthQueryString from 'githubauthquerystring'
import {
	Repository,
	RepositoryResponse,
	SearchResponse,
	SearchRepository
} from './types'
const ghapi = process.env.GITHUB_API || 'https://api.github.com'

/**
 * Search Query Options
 */
interface SearchOptions {
	/** If you wish to skip the first page, then set this param, defaults to 1 */
	page?: number
	/** If you wish to change the amount of items returned per page, then set this param */
	size?: number
	/** If you wish to fetch unlimited pages, set this to zero, if you wish to fetch a specific amount of pages, then set this accordingly, defaults to `10` */
	pages?: number
}

// =================================
// Fetch Directly

/**
 * Fetch data for Repostiory from Repository Name
 * @param repoFullName Repostory name, such as `'bevry/getrepos'`
 */
export async function fetchRepo(repoFullName: string): Promise<Repository> {
	try {
		const url = `${ghapi}/repos/${repoFullName}?${githubAuthQueryString.fetch()}`
		const resp = await fetch(url, {
			headers: {
				Accept: 'application/vnd.github.v3+json'
			}
		})
		const data = (await resp.json()) as RepositoryResponse
		if (data && data.message) throw data.message
		if (!data || !data.full_name)
			throw new Error('response was not a repository')
		return data as Repository
	} catch (err) {
		return Promise.reject(githubAuthQueryString.redact(err.message))
	}
}

/**
 * Fetch data for Repositories from Repository Names
 * @param repoFullNames Array of repository names, such as `['bevry/getcontributors', 'bevry/getrepos']`
 */
export async function fetchRepos(
	repoFullNames: string[]
): Promise<Repository[]> {
	return await Promise.all(
		repoFullNames.map(repoFullName => fetchRepo(repoFullName))
	)
}

// =================================
// Fetch from Search

/**
 * Fetch data for Repostiories from a Search, will iterate all subsequent pages
 * @param query The search query to send to GitHub, such as `@bevry/getcontributors @bevry/getrepos`
 */
export async function fetchReposFromSearch(
	query: string,
	opts: SearchOptions = {}
): Promise<SearchRepository[]> {
	if (opts.page == null) opts.page = 1
	if (opts.pages == null) opts.pages = 10
	if (opts.size == null) opts.size = 100
	try {
		// fetch
		const url = `${ghapi}/search/repositories?page=${opts.page}&per_page=${
			opts.size
		}&q=${encodeURIComponent(query)}&${githubAuthQueryString.fetch()}`
		const resp = await fetch(url, {
			headers: {
				Accept: 'application/vnd.github.v3+json'
			}
		})
		const data = (await resp.json()) as SearchResponse
		if (data && data.message) throw data.message
		if (!data || !data.items || !Array.isArray(data.items))
			throw new Error('response was not the format we expected')
		if (data.items.length === 0) return []
		const within = opts.pages === 0 || opts.page < opts.pages
		if (data.items.length === opts.size && within)
			return data.items.concat(
				await fetchReposFromSearch(
					query,
					Object.assign({}, opts, { page: opts.page + 1 })
				)
			)
		return data.items
	} catch (err) {
		return Promise.reject(githubAuthQueryString.redact(err.message))
	}
}

/**
 * Fetch data for Repostiories from Users
 * @param users Fetch repositories for these users, such as `['bevry', 'browserstate']`
 */
export async function fetchReposFromUsers(
	users: string[],
	opts: SearchOptions = {}
): Promise<SearchRepository[]> {
	const query = users.map(name => `@${name}`).join('%20')
	return await fetchReposFromSearch(query, opts)
}
