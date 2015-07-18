'use strict';
var imageList;

angular.module('jadenSmithApp')
.factory('ImageFactory', ['$resource', function($resource) {
    return function(){
      console.log("Searching for images");
      var pageNumber;
      if (!localStorage.getItem("pageNumber")) { 
        localStorage.setItem("pageNumber", "0");
      }
      else{
        var newPageNumber = localStorage.getItem("pageNumber");
        newPageNumber++
        // take out in production
        newPageNumber = newPageNumber > 5 ? 0 : newPageNumber;
        localStorage.setItem("pageNumber", newPageNumber.toString());
      }
      imageList = $resource("http://localhost:8080/api/images?page=" + localStorage.getItem("pageNumber")).get();
      return imageList.$promise.then(function (result) {
        imageList = result.images;
        return imageList;
        });    
    }
}]);

