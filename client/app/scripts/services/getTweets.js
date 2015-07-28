'use strict';
var pageCount = 0;
var lastUser = "";
angular.module('jadenSmithApp')
.factory('getTweets', ['$resource', '$q','$rootScope', function($resource, $q, $rootScope) {
	return function(user, reset) {
		$rootScope.loaderClass = $rootScope.loaderClass.concat(" active");
		var defer = $q.defer();
		if(user != lastUser || reset) pageCount = 0;
		lastUser = user;
		console.log("querying at " + "http://localhost:8080/api/tweets/" + user + "/" + pageCount);
		return $resource("http://localhost:8080/api/tweets/" + user + "/" + pageCount).get()
		.$promise.then(function(data) {
			console.log("Fetching tweets for " + user);
			var tweets = Object.keys(data.tweets).map(function (key){
				return data.tweets[key];
			});
			if (tweets.length > 0 ){
				pageCount++;
				console.log("Found " + tweets.length + " tweets "); 
				$rootScope.loaderClass = $rootScope.loaderClass.replace(" active", '');
				return tweets
			} 

		}, function(error){
			$rootScope.loaderClass = $rootScope.loaderClass.replace(" active", '');
			console.log("User not found");
		});
	 };
 }]);
