'use strict';
var images = new Array();
angular.module('jadenSmithApp')
.factory('getImages', ['$resource', '$q', function($resource, $q) {
    var getImage = function(){
        var defer = $q.defer();
        if(images.length > 0){
            defer.resolve(images.pop());
            return defer.promise;
        }
        else{
            console.log("Searching for images");
            var refresh = (new Date().getTime() - localStorage.getItem("timestamp")) >= 900000;
            console.log("image page number  " + localStorage.getItem("pageNumber"));
            if (!localStorage.getItem("pageNumber") || refresh) { 
                localStorage.setItem("pageNumber", "0");
                localStorage.setItem("timestamp", new Date().getTime());
                console.log("Page number reset");
            }
            else {
                var newPageNumber = localStorage.getItem("pageNumber");
                newPageNumber++;
                localStorage.setItem("pageNumber", newPageNumber.toString());
            }
            var imageList = $resource("api/images?page=" + localStorage.getItem("pageNumber")).get();
            return imageList.$promise.then(function (result) {
                images = images.concat(Object.keys(result.images).map(function(k){return result.images[k]}));
                defer.resolve(images.pop());
                return defer.promise;
            });               
        }
    }
    return function(){
       return getImage();
    }
}]);

