'use strict';
var imageList;
var currentImage = 0;
var totalImage = 0;

angular.module('jadenSmithApp')
.factory('getImage', ['$resource', function($resource) {
    return function(){
      console.log("Searching for images");
      currentImage = 0;
      imageList = $resource("http://localhost:8080/api/images").get();
      return imageList.$promise.then(function (result) {
        imageList = result.images;
        totalImage = Object.keys(imageList).length;
        return imageList;      
        });    
    }
}]);

