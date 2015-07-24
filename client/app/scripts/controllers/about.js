'use strict';

/**
 * @ngdoc function
 * @name jadenSmithApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jadenSmithApp
 */
angular.module('jadenSmithApp')
.controller('AboutCtrl', ['$scope', function($scope) {
    var path = '../../images/'
    $scope.brandon = path + 'brandon.png';
    $scope.jen = path + 'jen.jpg';
}]);
