
<!-- TITLE -->

<!-- BADGES -->

<!-- DESCRIPTION -->

<!-- INSTALL -->


## Usage

``` javascript
// Create our getrepos instance
var getter = require('getrepos').create({
	githubClientId: null,      // optional, will try process.env.GITHUB_CLIENT_ID
	githubClientSecret: null,  // optional, will try process.env.GITHUB_CLIENT_SECRET
	log: console.log           // optional, arguments: level, message... 
});

// Fetch the data on these github repositories
getter.fetchRepos(['bevry/getrepos'], function(err){
	console.log(err);

	// Fetch all the repo data on these github users/organisations
	getter.fetchReposFromUsers(['bevry'], function(err){
		console.log(err);

		// Get the combined listing
		console.log(getter.getRepos());
	});
});
```

Repos are returned as an array of [repository objects](https://api.github.com/repos/bevry/getrepos).


<!-- HISTORY -->

<!-- CONTRIBUTE -->

<!-- BACKERS -->

<!-- LICENSE -->
