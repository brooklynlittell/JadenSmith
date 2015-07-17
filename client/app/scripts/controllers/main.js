'use strict';
/**
 * @ngdoc function
 * @name jadenSmithApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jadenSmithApp
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

    //THIS SECTION NEEDS WORK PLEASE HELP
    $scope.onSearch = function() {
      // this is supposed to be async but always comes back early
      var theseTweetsAreBroken = getTweets($scope.username);
      for (var tweet in theseTweetsAreBroken){
        //generate 1 image for each new tweet
      }
      generateImage($scope.tweets[0], $scope.image = getImage(), $scope.username, $scope.justify, 0);
      $scope.showImages = true;
     };

  // functions for editing buttons
   $scope.onNewImage = function(tweet){
      console.log("Generating new image for " + tweet)
      generateImage(tweet, $scope.image = getImage(), $scope.username, $scope.justify, 0);
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


// on page load 
app.run(function ($rootScope, getImage){
  $rootScope.image = getImage();
});

app.subviewPath = '../../views/subviews/';
// html templating
app.directive('images', function() {
  return {
    templateUrl: app.subviewPath + 'images.html'
  };
});

app.directive('image', function() {
  return {
    templateUrl: app.subviewPath + 'image.html'
  };
});
app.directive('editimage', function() {
  return {
    templateUrl: app.subviewPath + 'editImage.html'
  };
});