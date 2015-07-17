'use strict';
/**
 * @ngdoc function
 * @name jadenSmithApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jadenSmithApp
 * All of the image controls, such as searching and pulling a new image
 */


/*
Note: Right now we only support 1 image view at a time. 

Long term, we want to store all tweets in $tweets,
and loop through them in 'onSearch'. 

For now, we are looping through the temTweets as well on newImage,
just to see the other tweets. 

I kept $tweets even though we aren't using its values, to see how 
the images handle the view of 2 different tweets

Once we have support for multiple images, we should delete $tempTweets 
and $tweetCount

*/

var app = angular.module('jadenSmithApp');

app.controller('MainCtrl', ['$scope', '$resource','$window','getTweets', 'getImage', 'generateImage', 
  function ($scope, $resource, $window, getTweets, getImage, generateImage) {
    $scope.username = 'officialjaden'
    // temp until tweets gets fixed
    $scope.tweets = ["Yeah Your Girl Is Bad But She Doesn't Smile.", "That Moment When Peeing Feels So Good You Start Crying."];
    $scope.image;
    $scope.showImages = false;
    $scope.justify = "CENTER";
    $scope.tweetCount = 0;
    $scope.tempTweets;

    $scope.onSearch = function() {
      // async stuff (slightly broken for images)
      $scope.tweetCount = 0;
      getTweets($scope.username).then(function(tweets){
        $scope.tempTweets = tweets;
        generateImage($scope.tempTweets[$scope.tweetCount], $scope.image = getImage(), $scope.username, $scope.justify, 0);
        $scope.showImages = true;
        $scope.tweetCount++;
      })
     };

  // functions for editing buttons
   $scope.onNewImage = function(tweet){
      console.log("Generating new image for " + tweet)
      generateImage($scope.tempTweets[$scope.tweetCount], $scope.image = getImage(), $scope.username, $scope.justify, 0);
      $scope.tweetCount++;    
    };
   $scope.onNewJustify = function(justify, tweet){
      console.log("Generating new justification " + justify + " for " + tweet)
      $scope.justify = justify;
      generateImage(tweet, $scope.image, $scope.username, $scope.justify, 0);
    };
  $scope.onDownload = function(id){
    console.log(id);
    var dataURL = document.getElementById(id).toDataURL('image/png');
    $window.open(dataURL, '_blank');
    };
  }]);
