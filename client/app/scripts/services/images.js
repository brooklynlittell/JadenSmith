'use strict';
var imageList;
var currentImage = 0;
var totalImage = 0;
var image;
angular.module('jadenSmithApp')
.factory('getImage', ['$resource', function($resource) {
   return function() {
   		// if we already have image in stack, search and return
   		if(currentImage < totalImage ){
   			return imageList[currentImage++];
   		}
   		// otherwwise search for new image
      else{
        return callInsta().then(function(data){
          return data;
        });
      }
    }
     function callInsta(){
       console.log("Searching for images");
       currentImage = 0;
       imageList = $resource("http://localhost:8080/api/images").get()
       return imageList.$promise.then(function (result) {
          imageList = result.images;
          totalImage = Object.keys(imageList).length;
          return imageList[currentImage++];
      });
     }
 }]);
