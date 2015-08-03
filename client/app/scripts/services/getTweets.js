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
		console.log("querying at " + "/api/tweets/" + user + "/" + pageCount);
		return $resource("/api/tweets/" + user + "/" + pageCount).get()
		.$promise.then(function(data) {
			var tweets = data[pageCount];
			if (tweets.length > 0 ){
				pageCount++;
				console.log("Found " + tweets.length + " tweets "); 
				$rootScope.loaderClass = $rootScope.loaderClass.replace(" active", '');
				return tweets;
			}
			else if(pageCount == 1 || pageCount == 0){
				return -1;
			} 
			else{
				$rootScope.loaderClass = $rootScope.loaderClass.replace(" active", '');
				return;
			
			} 

		}, function(error){
			$rootScope.loaderClass = $rootScope.loaderClass.replace(" active", '');
			console.log("User not found");
		});
	 };
 }]);
