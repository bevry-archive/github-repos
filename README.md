
<!-- TITLE/ -->

# Get Repos

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/bevry/getrepos/master.svg)](http://travis-ci.org/bevry/getrepos "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/getrepos.svg)](https://npmjs.org/package/getrepos "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/getrepos.svg)](https://npmjs.org/package/getrepos "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/bevry/getrepos.svg)](https://david-dm.org/bevry/getrepos)
[![Dev Dependency Status](https://img.shields.io/david/dev/bevry/getrepos.svg)](https://david-dm.org/bevry/getrepos#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Fetch the specified repositories, or those that match a particular github user or search query

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('getrepos')`
- Install: `npm install --save getrepos`

<!-- /INSTALL -->


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


<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/getrepos/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/getrepos/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/bevry/getrepos/commits?author=balupton)

[Become a contributor!](https://github.com/bevry/getrepos/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT license](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

<!-- /LICENSE -->


