'use strict';

/**
 * @ngdoc overview
 * @name jadenSmithApp
 * @description
 * # jadenSmithApp
 *
 * Main module of the application.
 */
angular
.module('jadenSmithApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'infinite-scroll'
])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
})
.directive('images', function() {
    return {
        templateUrl: 'views/subviews/images.html'
    };
})
.directive('image', function() {
    return {
        templateUrl: 'views/subviews/image.html'
    };
})
.directive('editimage', function() {
    return {
        templateUrl: 'views/subviews/editImage.html'
    };
})
.directive('errorMessage', function() {
    return {
        templateUrl: 'views/subviews/errorImage.html'
    };
});
