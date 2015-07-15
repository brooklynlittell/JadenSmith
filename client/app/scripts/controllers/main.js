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
  $scope.isSearch = false;
  $scope.searchTweets = function(){
    $scope.tweets = $resource("http://localhost:5000/tweets").get();
    $scope.isSearch = true;
    console.log($scope.isSearch);
  };

  $scope.$on('$viewContentLoaded', function () {
    $scope.image = $resource("http://localhost:5000/images").get();
  });
});

