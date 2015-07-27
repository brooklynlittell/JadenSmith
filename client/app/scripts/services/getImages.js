'use strict';
var images = new Array();
var imageLock = false;
angular.module('jadenSmithApp')
.factory('getImages', ['$resource', '$q', function($resource, $q) {
    return function(){
        var defer = $q.defer();
        if(images.length > 0){
            defer.resolve(images.pop());
            return defer.promise;
        }
        else if (!imageLock){
            imageLock = true;
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
            var imageList = $resource("http://localhost:8080/api/images?page=" + localStorage.getItem("pageNumber")).get();
            
            return imageList.$promise.then(function (result) {
                images = images.concat(Object.keys(result.images).map(function(k){return result.images[k]}));
                imageLock = false;
                defer.resolve(images.pop());
                return defer.promise;
            });               
        }
        else{
            defer.resolve(null);
            return defer.promise;
        }
 
    }
}]);

