# History

## v5.15.0 2020 August 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.14.0 2020 August 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.13.0 2020 July 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.12.0 2020 July 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.11.0 2020 June 25

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.10.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.9.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.8.0 2020 June 20

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.7.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.6.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.5.0 2020 May 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.4.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.3.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.2.1 2020 May 11

-   Fixed 429 delay, had 60 milliseconds instead of 60 seconds

## v5.2.0 2020 May 11

-   If status code `429` is returned, will try again in a minute
-   Added optional `concurrency` argument to `getRepos`
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.1.0 2020 May 6

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.0.1 2020 April 27

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.0.0 2020 March 27

-   Updated for [GitHub's new authorization recommendations](https://developer.github.com/changes/2020-02-10-deprecating-auth-through-query-param)
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=0.8` to `node: >=8` to keep up with mandatory ecosystem changes

## v4.0.3 2020 March 27

-   Fixed for latest TypeScript
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.0.2 2019 December 16

-   Fix missing dependency

## v4.0.1 2019 December 16

-   Updated README example for v4.0.0 API change

## v4.0.0 2019 December 16

-   Renamed API from `fetch*` to `get*`

## v3.0.1 2019 December 16

-   Fix type exports

## v3.0.0 2019 December 16

-   Rewrote in TypeScript
-   API now uses Promises instead of Errbacks

## v2.0.1 2019 December 9

-   Fix `GITHUB_API` fallback

## v2.0.0 2019 December 9

-   Implemented support for `GITHUB_API` environment variable to access the GitHub API via a proxy
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=0.8` to `node: >=8` to keep up with mandatory ecosystem changes

## v1.5.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.4.0 2019 November 8

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.3.0 2018 November 28

-   No longer accepts the github auth credentials in configuration, use environment variables instead
    -   Internally we now use [githubauthquerystring](https://github.com/bevry/githubauthquerystring) to determine the github auth string
-   Fixed error cases of `requestRepo` returning an array as the result instead of nothing
-   Better documentation

## v1.2.0 2018 November 28

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.1.2 2017 February 28

-   Updated dependencies

## v1.1.1 2017 February 28

-   Internal: explicit use of GitHub API version

## v1.1.0 2017 February 27

-   Converted from CoffeeScript to JavaScript
-   Fixed rate limit errors not being caught
-   Added technical API documentation
-   Updated dependencies

## v1.0.7 2014 December 11

-   Repackaged

## v1.0.6 2014 December 11

-   Updated dependencies

## v1.0.5 2013 November 27

-   Updated GitHub Search API header from `preview` to `beta`
-   Updated dependencies

## v1.0.4 2013 October 4

-   Fetch repositories individually instead of by search by default
-   Updated dependencies

## v1.0.3 2013 October 3

-   Updated dependencies

## v1.0.2 2013 October 2

-   Fixed v1.0.1

## v1.0.1 2013 October 2

-   Fixed paging limits

## v1.0.0 2013 October 2

-   Initial working release
