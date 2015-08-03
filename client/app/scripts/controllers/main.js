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


app.controller('MainCtrl', ['$scope','$rootScope','$route', '$resource','$location','$window','getTweets','getImages','generateImage', 
    function ($scope, $rootScope, $route, $resource, $location, $window, getTweets, getImages, generateImage) {
        $scope.username = 'officialjaden';
        $scope.justify = "center";
        $scope.align = "middle"
        $scope.isLoading = "ui teal basic button";

        $scope.timer;
        $scope.tweetPage = 0;
        $scope.imageList = new Array();

        $scope.userNotFound;        
        $scope.showImages = false;
        $scope.imageStatusEnd = false;
        $scope.canvas = document.createElement('canvas');
        $scope.image;
        $rootScope.loaderClass = "ui centered inline loader";
        var RESET = true;
        var KEEP = false;
        $scope.tweetsLock = false;

        $scope.init = function(){
        	$scope.tweetsLock = false;

        	getImages().then(function(image){
        		$scope.image = image;
        		$scope.tweetsLock = true;
        	});
        console.log("Found images");
        var urlParam = $location.search().username;
        if(urlParam){
            $scope.username = urlParam;
            $scope.onSearch();
            }  
        }

        $scope.onSearch = function() {

            $scope.tweets = null;
            $scope.imageList = [];
            $location.search('username', $scope.username);
            $scope.isLoading = "ui loading button"
            $scope.timer = new Date();
            $scope.userNotFound = false;        
            $scope.tweetsLock = true;
            getTweets($scope.username, RESET).then(function(tweets){
                if(!tweets || tweets.length === 0){
        			$scope.notFound();
        			$scope.tweetsLock = false;
                    return;      
                }
                angular.forEach(tweets, function(value){
	                $scope.getImage(value);
	            	});
                $scope.tweetsLock = false;
                $scope.timer = new Date() - $scope.timer;
                console.log("Request handeled in " + $scope.timer + " milliseconds");  
                });
                           	

            
        };

        var moreTweetsLock = false;
        $scope.moreTweets = function(){
        	if($scope.userNotFound || $scope.imageStatusEnd  ||  $scope.tweetsLock) return;
        	$scope.tweetsLock = true;
        	$scope.getMoreTweets();

        }
        $scope.getMoreTweets = function() {
        	console.log("getting more tweets");
            getTweets($scope.username, KEEP).then(function(tweets){
            	$scope.tweetsLock = false;
            	if(tweets === -1 ) moreTweets();
                $scope.imageStatusEnd = !tweets || tweets.length === 0;
 				angular.forEach(tweets, function(value){
	                $scope.getImage(value);
	            });     
	            $scope.tweetsLock = false;       
 			});
        };

        $scope.onNewJustify = function(justify, index){
            $scope.imageList[index] = (generateImage($scope.imageList[index].tweet,  $scope.imageList[index].image, $scope.username, justify, $scope.align));
        };
        $scope.onNewAlign = function(align, index){
            $scope.imageList[index] = (generateImage($scope.imageList[index].tweet, $scope.imageList[index].image, $scope.username, $scope.justify, align));
        }
        $scope.onDownload = function(index) {
            //TODO: Change this document.get call
            var poster = document.getElementById("poster" + index);
            angular.element(document).ready(function (){
                html2canvas(poster, {
                proxy: '/api/proxy',
                onrendered: function(canvas) {
                    $window.open(canvas.toDataURL('image/png'));   
                    console.log(canvas.toDataURL('image/png'));                   
                    }
                });
            });
        };
        $scope.newImage = function(index, tweet){
            $scope.timer = new Date();
              // if we need to get more images
            getImages().then(function(image) {
            	if(!image) return;
                $scope.imageList[index] = (generateImage($scope.imageList[index].tweet, image, $scope.username, $scope.justify, $scope.align));
                $scope.afterImage(); 
            });
        }    
        // pulls the next image, or queries for more images, if necessary
        $scope.getImage = function(tweet) {         
            // if we need to get more images
            getImages().then(function(image) {
            	if(!image) return;
            	$scope.image = image
            	$scope.imageList.push(generateImage(tweet, $scope.image, $scope.username, $scope.justify, $scope.align));
            	$scope.afterImage();
            });                    
        }                 
        $scope.afterImage = function(){
            $scope.isLoading = "ui teal basic button";
            $scope.showImages = true;
        };
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
    }
]);
