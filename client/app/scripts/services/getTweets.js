'use strict';
var pageCount = 0;
var lastUser = "";
angular.module('jadenSmithApp')
.factory('getTweets', ['$resource', function($resource) {
	return function(user) {
		if(user != lastUser) pageCount = 0;
		lastUser = user;
		console.log("querying at " + "http://localhost:8080/api/tweets/" + user + "/" + pageCount);
		return $resource("http://localhost:8080/api/tweets/" + user + "/" + pageCount).get()
		.$promise.then(function(data) {
			console.log("Fetching tweets for " + user);
			var tweets = Object.keys(data.tweets).map(function (key){
				return data.tweets[key];
			});
			if (tweets.length > 0 ) pageCount++;
			console.log("Found " + tweets.length + " tweets ");
			return tweets;
		}, function(error){
			console.log("User not found");
		});
	 };
 }]);
