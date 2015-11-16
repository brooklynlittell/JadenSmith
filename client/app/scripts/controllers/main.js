'use strict';
/**
 * @ngdoc function
 * @name jadenSmithApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jadenSmithApp
 * All of the image controls, such as searching and pulling a new image
 */

var app = angular.module('jadenSmithApp');


app.controller('MainCtrl', ['$scope','$rootScope','$route', '$resource','$window','getTweets','getImages','generateImage', 
    function ($scope, $rootScope, $route, $resource, $window, getTweets, getImages, generateImage) {
        $scope.username = 'officialjaden';
        $scope.justify = "center";
        $scope.alignment = "middle"
        $scope.isLoading = "ui teal basic button";

        $scope.timer;
        $scope.imageList = new Array();

        $scope.userNotFound;        
        $scope.imageStatusEnd = false;
        $scope.canvas = document.createElement('canvas');
        $rootScope.loaderClass = "ui centered inline loader";
        var RESET = true;
        var KEEP = false;

        $scope.onSearch = function() {
            $scope.imageList = [];
            $scope.isLoading = "ui loading button"
            $scope.timer = new Date();
            $scope.userNotFound = false;        
            getTweets($scope.username, RESET).then(function(tweets){
                if(!tweets || tweets.length === 0){
        			$scope.notFound();
                    return;      
                }
                angular.forEach(tweets, function(value){
	                $scope.getImage(value);
	            });
                $scope.timer = new Date() - $scope.timer;
                console.log("Request handeled in " + $scope.timer + " milliseconds");  
                });      
        };
        $scope.moreTweets = function(){
        	if($scope.userNotFound || $scope.imageStatusEnd) return;
        	$scope.getMoreTweets();

        }
        $scope.getMoreTweets = function() {
        	console.log("getting more tweets");
            getTweets($scope.username, KEEP).then(function(tweets){
                $scope.imageStatusEnd = !tweets || tweets.length === 0;
 				angular.forEach(tweets, function(value){
	                $scope.getImage(value);
	            });     
 			});
        };

        $scope.onNewJustify = function(justify, index){
            $scope.imageList[index].justify = justify;
            console.log($scope.imageList[index].alignment);
            $scope.updateImage(index);
        };
        $scope.onNewAlign = function(alignment, index){
            $scope.imageList[index].alignment = alignment;
            $scope.updateImage(index);
        }
        $scope.onDownload = function(index) {
            //TODO: Change this document.get call
            var poster = document.getElementById("poster" + index);
            angular.element(document).ready(function (){
                html2canvas(poster, {
                proxy: '/api/proxy',
                onrendered: function(canvas) {
                    $window.open(canvas.toDataURL('image/png'));   
                    }
                });
            });
        };
        $scope.newImage = function(index, tweet){
            $scope.timer = new Date();
              // if we need to get more images
            getImages().then(function(image) {
            	if(!image) return;
                $scope.imageList[index].image = image;
                $scope.updateImage(index);
                $scope.isLoading = "ui teal basic button";
            });
        }    
        // pulls the next image, or queries for more images, if necessary
        $scope.getImage = function(tweet) {         
            // if we need to get more images
            getImages().then(function(image) {
            	if(!image) return;
            	$scope.image = image
            	$scope.imageList.push(generateImage(tweet, $scope.image, $scope.username, "center", "middle"));
                $scope.isLoading = "ui teal basic button";
            });                    
        }                 

        $scope.notFound = function(){
	        $scope.timer = new Date() - $scope.timer;
	        $scope.userNotFound = true;
	        $scope.isLoading = "ui teal basic button";
	        $scope.errorMessage = "Twitter account " + $scope.username + " not found";
	        getImages().then(function(image){
	        	$scope.errorImage = image;
	        	console.log("Request handeled in " + $scope.timer + " milliseconds"); 
	        });
        }
        $scope.toTop = function(){
        	$window.scrollTo(0,0);
        }
        $scope.updateImage = function(index){
            $scope.imageList[index] = (generateImage($scope.imageList[index].tweet, $scope.imageList[index].image, $scope.username, $scope.imageList[index].justify,  $scope.imageList[index].alignment));
        }
    }
]);
