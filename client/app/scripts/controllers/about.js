'use strict';

/**
 * @ngdoc function
 * @name jadenSmithApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jadenSmithApp
 */
angular.module('jadenSmithApp')
.controller('GreetingController', ['$scope', function($scope) {
  $scope.greeting = 'Hola!';
}]);