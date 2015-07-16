'use strict';

angular.module('jadenSmithApp')
.service('getTweets', ['$resource', function($resource) {
	return function(user) {
		$resource("http://localhost:5000/tweets").get()
		.$promise.then(function(data) {
			console.log("Fetching tweets for " + user);
			var tweets = Object.keys(data.tweets);
			console.log(tweets);
			return tweets;
		});
	 };
 }]);
