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
        $scope.username = '';
        $scope.justify = "center";
        $scope.isLoading = "ui teal basic button";

        $scope.tweets = [];
        $rootScope.image = [];
        $scope.timer;
        $scope.tweetPage = 0;
        $scope.imageList = new Array();

        $scope.tweetsLock = false;
        $scope.imagesLock = false;
        $scope.userNotFound = false;        
        $scope.showImages = false;
        $scope.imageStatusEnd = false;
        $scope.canvas = document.createElement('canvas');


        $scope.init = function(){
        if($rootScope.image.length < 1){
            $scope.imagesLock = true;
            getImages().then(function(data){
                $rootScope.image = $rootScope.image.concat(data);
                console.log("Found images");
                var urlParam = $location.search().username;
                if(urlParam){
                    $scope.username = urlParam;
                    $scope.onSearch();
                    }  
                });
            $scope.imagesLock = false;            
        }
        else {
            var urlParam = $location.search().username;
                if(urlParam){
                    $scope.username = urlParam;
                    $scope.onSearch();
                }
             }
         }
        $scope.onSearch = function() {
            $scope.tweets = null;
            $scope.imageList = [];
            $location.search('username', $scope.username);
            $scope.isLoading = "ui loading button"
            console.log("Getting tweets");
            $scope.timer = new Date();
            $scope.tweetsLock = true;
            getTweets($scope.username).then(function(tweets){
                if(!tweets){
                    $scope.userNotFound = true;
                    $scope.isLoading = "ui teal basic button";
                    $scope.timer = new Date() - $scope.timer;
                    $scope.errorMessage = "Twitter account " + $scope.username + " not found";
                    $scope.errorImage = $rootScope.image.pop();
                    $scope.tweets = "";
                    console.log("Request handeled in " + $scope.timer + " milliseconds");   
                    return;      
                }
                if(tweets.length == 0){
                    console.log("Url error");
                }
                $scope.userNotFound = false;        
                $scope.tweets = tweets;
                for (var tweet in tweets)
                {
                    $scope.getImage(tweets[tweet]);
                }
                $scope.tweetsLock = false;
                $scope.timer = new Date() - $scope.timer;
                console.log("Request handeled in " + $scope.timer + " milliseconds");   
            });
        };
        $scope.moreTweets = function(){
            if (!$scope.tweetsLock && $scope.username) $scope.moreTweetsLock();
        }

        $scope.moreTweetsLock = function() {
            $scope.tweetsLock = true;
            getTweets($scope.username).then(function(tweets){
                $scope.tweets = $scope.tweets.concat(tweets);
                $scope.imageStatusEnd = tweets.length === 0 ? true : false;
                for (var tweet in tweets) $scope.getImage(tweets[tweet]);
                $scope.tweetsLock = false;
            });
        };

        $scope.onNewJustify = function(justify, index){
            $scope.imageList[index] = (generateImage($scope.imageList[index].tweet,  $scope.imageList[index].image, $scope.username, justify));
        };
        
        $scope.onDownload = function(index) {
            var poster = document.getElementById("poster" + index)
            angular.element(document).ready(function (){
                html2canvas(poster, {
                onrendered: function(canvas) {
                document.body.appendChild(canvas);
                $window.open(canvas.toDataURL('image/png'));
                    }
                });
            });
        };
        $scope.newImage = function(index, tweet){
            $scope.timer = new Date();
              // if we need to get more images
            if ($rootScope.image.length < 1 ) {
                if(!$scope.imagesLock){
                    $scope.imagesLock = true;
                    console.log("No more images. Querying for more.");
                    getImages().then(function(data) {
                        $rootScope.image.concat(data);
                        $scope.imageList[index] = (generateImage($scope.imageList[index].tweet,  $rootScope.image.pop(), $scope.username, $scope.justify));
                        $scope.afterImage(); 
                    });
                }
            }
            else {
                $scope.imageList[index] = (generateImage($scope.imageList[index].tweet,  $rootScope.image.pop(), $scope.username, $scope.justify));
                $scope.afterImage();
            }            
        }
        // pulls the next image, or queries for more images, if necessary
        $scope.getImage = function(tweet) {         
            // if we need to get more images
            if ($rootScope.image.length < 1) {
                if(!$scope.imagesLock){
                    $scope.imagesLock = true;
                    console.log("No more images. Querying for more.");
                    getImages().then(function(data) {
                        console.log("Found images");
                        $rootScope.image.concat(data);
                        $scope.imageCount = 0;
                        $scope.drawImage(tweet);
                    });                    
                }
            }
            else {
                $scope.drawImage(tweet);
            }            
        };
        // actually calling the image generation class
        $scope.drawImage = function(tweet){
            $scope.imageList.push(generateImage(tweet, $rootScope.image.pop(), $scope.username, $scope.justify));
            $scope.afterImage();
        };
        $scope.afterImage = function(){
            $scope.isLoading = "ui teal basic button";
            $scope.showImages = true;
            $scope.imagesLock = false
        };
        var lastRoute = $route.current;
        $scope.$on('$locationChangeSuccess', function(event) {
            $route.current = lastRoute;
        });
    }
]);
// Templates
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
app.directive('errorMessage', function() {
    return {
        templateUrl: app.subviewPath + 'errorImage.html'
    };
});
