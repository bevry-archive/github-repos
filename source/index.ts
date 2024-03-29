/* eslint camelcase:0 */

// external
import { StrictUnion } from 'simplytyped'
import Pool from 'native-promise-pool'
import { query, GitHubCredentials } from '@bevry/github-api'
import { append } from '@bevry/list'

// =================================
// Types

/** Options for queries that return multiple results. */
export interface MultiOptions {
	/** If you wish to skip the first page, then set this param, defaults to 1 */
	page?: number

	/** If you wish to change the amount of items returned per page, then set this param */
	size?: number

	/** If you wish to fetch unlimited pages, set this to zero, if you wish to fetch a specific amount of pages, then set this accordingly, defaults to `10` */
	pages?: number

	/** How many requests to make at once, defaults to `0` which is unlimited. */
	concurrency?: number
}

/**
 * GitHub's error response
 * https://developer.github.com/v3/
 */
export interface Error {
	message: string
	documentation_url?: string
	errors?: Array<{
		resource: string
		field: string
		code: string
	}>
}

/**
 * GitHub's Repository Response will either be a repository, or if invalid, an error
 */
export type RepositoryResponse = StrictUnion<Error | Repository>

/**
 * GitHub's Search Response will either be a search result, or if invalid, an error
 */
export type SearchResponse = StrictUnion<Error | Search>

/**
 * GitHub's response to searching for repositories
 * https://developer.github.com/v3/search/#search-repositories
 */
export interface Search {
	total_count: number
	incomplete_results: boolean
	items: SearchRepository[]
}

/**
 * Search results return a subset of the full repository results
 */
export interface SearchRepository {
	id: number
	node_id: string
	name: string
	full_name: string
	owner: Owner
	private: boolean
	html_url: string
	description: string
	fork: boolean
	url: string
	created_at: Date
	updated_at: Date
	pushed_at: Date
	homepage: string
	size: number
	stargazers_count: number
	watchers_count: number
	language: string
	forks_count: number
	open_issues_count: number
	master_branch: string
	default_branch: string
	score: number
}

/**
 * The owner of a repository
 */
export interface Owner {
	login: string
	id: number
	node_id: string
	avatar_url: string
	gravatar_id: string
	url: string
	received_events_url: string
	type: string
}

/**
 * GitHub's response to getting a repository
 * https://developer.github.com/v3/repos/#get
 */
export interface Repository extends SearchRepository {
	archive_url: string
	assignees_url: string
	blobs_url: string
	branches_url: string
	collaborators_url: string
	comments_url: string
	commits_url: string
	compare_url: string
	contents_url: string
	contributors_url: string
	deployments_url: string
	downloads_url: string
	events_url: string
	forks_url: string
	git_commits_url: string
	git_refs_url: string
	git_tags_url: string
	git_url: string
	issue_comment_url: string
	issue_events_url: string
	issues_url: string
	keys_url: string
	labels_url: string
	languages_url: string
	merges_url: string
	milestones_url: string
	notifications_url: string
	pulls_url: string
	releases_url: string
	ssh_url: string
	stargazers_url: string
	statuses_url: string
	subscribers_url: string
	subscription_url: string
	tags_url: string
	teams_url: string
	trees_url: string
	clone_url: string
	mirror_url: string
	hooks_url: string
	svn_url: string
	is_template: boolean
	topics: string[]
	has_issues: boolean
	has_projects: boolean
	has_wiki: boolean
	has_pages: boolean
	has_downloads: boolean
	archived: boolean
	disabled: boolean
	visibility: string
	permissions: Permissions
	allow_rebase_merge: boolean
	template_repository: null
	allow_squash_merge: boolean
	allow_merge_commit: boolean
	subscribers_count: number
	network_count: number
	license?: License
	organization?: Organization
	parent?: Repository
	source?: Repository
}

/**
 * The license of a repository
 */
export interface License {
	key: string
	name: string
	spdx_id: string
	url: string
	node_id: string
}

/**
 * The organization of a repository
 */
export interface Organization {
	login: string
	id: number
	node_id: string
	avatar_url: string
	gravatar_id: string
	url: string
	html_url: string
	followers_url: string
	following_url: string
	gists_url: string
	starred_url: string
	subscriptions_url: string
	organizations_url: string
	repos_url: string
	events_url: string
	received_events_url: string
	type: string
	site_admin: boolean
}

/**
 * The permissions of a repository
 */
export interface Permissions {
	admin: boolean
	push: boolean
	pull: boolean
}

// =================================
// Fetch Repository

/**
 * Fetch data for a repository from a repository slug (org/name)
 * @param slug repository slug, such as `'bevry/github-repos'`
 * @param credentials custom github credentials, omit to use the environment variables
 */
export async function getRepo(
	slug: string,
	credentials?: GitHubCredentials,
): Promise<Repository> {
	const resp = await query({
		pathname: `repos/${slug}`,
		userAgent: '@bevry/github-repos',
		credentials,
	})
	const data: RepositoryResponse = await resp.json()
	if (data && data.message) throw data.message
	if (!data || !data.full_name) throw new Error('response was not a repository')
	return data as Repository
}

/**
 * Fetch data for repositories from their repository slugs
 * @param slugs array of repository slugs, such as `['bevry/github-commit', 'bevry/github-repos']`
 * @param opts custom search options
 * @param credentials custom github credentials, omit to use the environment variables
 */
export async function getRepos(
	slugs: string[],
	opts: MultiOptions = {},
	credentials?: GitHubCredentials,
): Promise<Repository[]> {
	const pool = new Pool(opts.concurrency)
	return await Promise.all(
		slugs.map((slug) => pool.open(() => getRepo(slug, credentials))),
	)
}

// =================================
// Fetch from Search

/**
 * Fetch data for repositories from a search, will iterate all subsequent pages
 * @param search the search query to send to GitHub, such as `@bevry language:typescript`
 * @param opts custom search options
 * @param credentials custom github credentials, omit to use the environment variables
 */
export async function getReposFromSearch(
	search: string,
	opts: MultiOptions = {},
	credentials?: GitHubCredentials,
): Promise<SearchRepository[]> {
	// defaults
	if (opts.page == null) opts.page = 1
	if (opts.pages == null) opts.pages = 10
	if (opts.size == null) opts.size = 100

	// fetch
	const resp = await query({
		pathname: `search/repositories`,
		searchParams: {
			page: String(opts.page),
			per_page: String(opts.size),
			q: search,
		},
		userAgent: '@bevry/github-repos',
		credentials,
	})
	const data: SearchResponse = await resp.json()

	// prepare
	const results: Array<SearchRepository> = []

	// check
	if (data && data.message) throw data.message
	if (!data || !data.items || !Array.isArray(data.items))
		throw new Error('response was not the format we expected')
	if (data.items.length === 0) return results

	// add these items
	append(results, data.items)

	// add next items
	const within = opts.pages === 0 || opts.page < opts.pages
	const anotherPage = data.items.length === opts.size && within
	if (anotherPage)
		append(
			results,
			await getReposFromSearch(
				search,
				{ ...opts, page: opts.page + 1 },
				credentials,
			),
		)

	// return it all
	return results
}

/**
 * Fetch data for repositories from user/org names
 * @param users fetch repositories for these users, such as `['bevry', 'browserstate']`
 * @param opts custom search option
 * @param credentials custom github credentials, omit to use the environment variables
 */
export async function getReposFromUsers(
	users: string[],
	opts: MultiOptions = {},
	credentials?: GitHubCredentials,
): Promise<SearchRepository[]> {
	const query = users.map((name) => `@${name}`).join('%20')
	return await getReposFromSearch(query, opts, credentials)
}
