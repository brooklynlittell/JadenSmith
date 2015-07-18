'use strict';
/**
 * @ngdoc Directives used on the main page
 * @name jadenSmithApp.controller:MainDirectives
 * @description
 */
var app = angular.module('jadenSmithApp');

// on page load 
app.run(function ($rootScope, getImage){
    getImage().then(function(data){
        $rootScope.image = data;
        console.log("Found images");
    });
});


// html templating
app.subviewPath = '../../views/subviews/';

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