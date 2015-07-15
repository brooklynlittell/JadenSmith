'use strict';
/**
 * @ngdoc function
 * @name jadenSmithApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jadenSmithApp
 */

angular.module('jadenSmithApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('jadenSmithApp')
.controller('MainCtrl', function($scope, $resource) {
  $scope.user = 'officialjaden';
  $scope.searchTweets = function(){
    $scope.tweets = $resource("http://localhost:5000/tweets").get();
  };

  $scope.$on('$viewContentLoaded', function () {
    $scope.image = $resource("http://localhost:5000/images").get();
  });
});
