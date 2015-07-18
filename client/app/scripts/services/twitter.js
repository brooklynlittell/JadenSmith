'use strict';

angular.module('jadenSmithApp')
.factory('getTweets', ['$resource', function($resource) {
	return function(user) {
		return $resource("http://localhost:8080/api/tweets?user=" + user).get()
		.$promise.then(function(data) {
			console.log("Fetching tweets for " + user);
			var tweets = Object.keys(data.tweets).map(function (key){
				return data.tweets[key];
			});
			console.log("Found " + tweets.length + " tweets ");
			return tweets;
		});
	 };
 }]);
