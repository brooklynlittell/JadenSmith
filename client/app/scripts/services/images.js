'use strict';
var imageList;
var currentImage = 0;
var totalImage = 0;

angular.module('jadenSmithApp')
.service('getImage', ['$resource', function($resource) {
   return function() {
   		// if we already have image in stack, search and return
   		if(currentImage < totalImage ){
   			return getTopImage();
   		}
   		// otherwwise search for new image
       console.log("Searching for images");
       currentImage = 0;
       imageList = $resource("http://localhost:8080/api/images").get()
       imageList.$promise.then(function (result) {
       		imageList = result.images;
       		totalImage = Object.keys(imageList).length;
       		return getTopImage();
		});
     }

     function getTopImage(){
     	// get image at top of the stack
     	return imageList[currentImage++];
     }
 }]);
