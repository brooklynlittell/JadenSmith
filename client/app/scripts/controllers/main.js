'use strict';
/**
 * @ngdoc function
 * @name jadenSmithApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jadenSmithApp
 */


angular.module('jadenSmithApp')
.controller('MainCtrl', function($scope, $resource) {
  $scope.user = 'officialjaden';
  $scope.tweetList = null;
  $scope.imageList = null;
  $scope.currentTweet = 0;
  $scope.currentImage = 0;
  $scope.isSearch = false;

  $scope.getTweets = function(){
    $scope.tweetList = $resource("http://localhost:5000/tweets").get();
    $scope.isSearch = true;
    console.log($scope.isSearch);
  };

  $scope.newImage = function(){
  	$scope.currentImage++;
  	// Loop images
  	if($scope.currentImage >= Object.keys($scope.imageList.images).length)
  	{
  		$scope.currentImage = 0;
  	}
  };

  $scope.newTweet = function(){
  	$scope.currentTweet++;
  	// TODO: Fix for tweet structure
  	// Tweets are listed on a frequency index, not an enumeration
  	if($scope.currentTweet >= Object.keys($scope.tweetList.tweets).length)
  	{
  		$scope.currentTweet = 0;
  	}
  };

  $scope.generateImage = function(){
  	//console.log($scope.imageList.images[$scope.currentImage]);
  };

  $scope.onSearchUser = function(){
  	$scope.getTweets(/*user*/);
  	$scope.generateImage();
  };

  $scope.onNewImage = function(){
  	$scope.newImage();
  	$scope.generateImage();
  };

  $scope.$on('$viewContentLoaded', function () {
    $scope.imageList = $resource("http://localhost:5000/images").get();
    $scope.getTweets();
    console.log($scope.imageList);
  });
});

