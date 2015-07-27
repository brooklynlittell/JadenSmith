'use strict';
var pageCount = 0;
var lastUser = "";
var lastCount;
angular.module('jadenSmithApp')
.factory('getTweets', ['$resource', '$q', function($resource, $q) {
	return function(user) {
		var defer = $q.defer();
		if(pageCount === lastCount){
			console.log("stacking requests. doing nothing");
			defer.resolve(null);
            return defer.promise;
		}
		if(user != lastUser) pageCount = 0;
		lastUser = user;
		lastCount = pageCount;
		console.log("querying at " + "http://localhost:8080/api/tweets/" + user + "/" + pageCount);
		return $resource("http://localhost:8080/api/tweets/" + user + "/" + pageCount).get()
		.$promise.then(function(data) {
			console.log("Fetching tweets for " + user);
			var tweets = Object.keys(data.tweets).map(function (key){
				return data.tweets[key];
			});
			if (tweets.length > 0 ){
				pageCount++;
			} 
			console.log("Found " + tweets.length + " tweets ");
			return tweets;
		}, function(error){
			console.log("User not found");
		});
	 };
 }]);
