'use strict';
var pageCount = 0;
angular.module('jadenSmithApp')
.factory('getTweets', ['$resource', function($resource) {
	return function(user) {
		return $resource("http://localhost:8080/api/tweets/" + user + "/" + pageCount).get()
		.$promise.then(function(data) {
			console.log("Fetching tweets for " + user);
			pageCount = Object.keys(data.tweets);
			pageCount = pageCount[pageCount.length-1]
			var tweets = Object.keys(data.tweets).map(function (key){
				return data.tweets[key];
			});

			console.log("Found " + tweets.length + " tweets ");
			return tweets;
		}, function(error){
			console.log("User not found");
		});
	 };
 }]);
