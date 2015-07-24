'use strict';
/**
 * @ngdoc function
 * @name jadenSmithApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jadenSmithApp
 * All of the image controls, such as searching and pulling a new image
 */


/*
Note: Right now we only support 1 image view at a time. 

Long term, we want to store all tweets in $tweets,
and loop through them in 'onSearch'. 

For now, we are looping through the temTweets as well on newImage,
just to see the other tweets. 

I kept $tweets even though we aren't using its values, to see how 
the images handle the view of 2 different tweets

Once we have support for multiple images, we should delete $tempTweets 
and $tweetCount

*/

var app = angular.module('jadenSmithApp');


app.controller('MainCtrl', ['$scope','$rootScope','$resource','$location','$window','getTweets','getImages','generateImage', 
    function ($scope, $rootScope, $resource, $location, $window, getTweets, getImages, generateImage) {
        $rootScope.username = 'officialjaden';
        // temp until tweets gets fixed
        $scope.tweets = ["Yeah Your Girl Is Bad But She Doesn't Smile.", "That Moment When Peeing Feels So Good You Start Crying."];
        $scope.showImages = false;
        $scope.justify = "center";
        $scope.tempTweets = [];
        $rootScope.image = [];
        $scope.imageStatus = '';
        $scope.imageStatusEnd = false;
        $scope.timer;
        $scope.imageList = new Array();
        $scope.tweetPage = 0;
        $scope.tweetsLock = false;
        $scope.imagesLock = false;
        $scope.textStyle = "{'font-size': 52}";
       
        $scope.init = function(){
        $scope.imagesLock = true;
        getImages().then(function(data){
            console.log(data);
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
        $scope.onSearch = function() {
            $scope.tempTweets = null;
            $scope.imageList = [];
            $rootScope.username = $scope.username;
            $location.search('username', $rootScope.username);
            $scope.imageStatus = 'loading.....'
            // async stuff (slightly broken for images)
            console.log("Getting tweets");
            $scope.tweetsLock = true;
            getTweets($rootScope.username).then(function(tweets){
                $scope.tempTweets = tweets;
                for (var tweet in tweets)
                {
                    $scope.timer = new Date();
                    $scope.getImage(tweets[tweet], tweet);
                }
                $scope.tweetsLock = false;
            });
        };
        $scope.moreTweets = function(){
            if (!$scope.tweetsLock){
                $scope.moreTweetsLock();
            }
            else{
                console.log("Next page locked");
            }
        }
        $scope.moreTweetsLock = function() {
            // async stuff (slightly broken for images)
            $scope.tweetsLock = true;
            getTweets($rootScope.username).then(function(tweets){
                $scope.tempTweets = $scope.tempTweets.concat(tweets);
                if (tweets.length === 0){
                    $scope.imageStatusEnd = true;
                }
                for (var tweet in tweets)
                {
                    $scope.timer = new Date();
                    $scope.getImage(tweets[tweet]);
                }
                $scope.tweetsLock = false;
            });
        };

        $scope.onNewJustify = function(justify, index){
            console.log("Generating new justification " + justify +  "at index " + index);
            $scope.imageList[index] = (generateImage($scope.imageList[index].tweet,  $scope.imageList[index].image, $scope.username, justify, 0));
        };
        
        $scope.onDownload = function(id) {
            var dataURL = document.getElementById(id).toDataURL('image/png');
            $window.open(dataURL, '_blank');
        };
        $scope.newImage = function(index, tweet){
            console.log(index + " " + tweet);
            console.log($scope.imageList);
            $scope.timer = new Date();
              // if we need to get more images
            if ($rootScope.image.length > 0 ) {
                if(!$scope.imagesLock){
                    $scope.imagesLock = true;
                    console.log("No more images. Querying for more.");
                    getImages().then(function(data) {
                        $rootScope.image = data;
                        $scope.imageList[index] = (generateImage($scope.imageList[index].tweet,  $rootScope.image.pop(), $scope.username, $scope.justify, 0));
                        $scope.afterImage(); 
                    });
                }
            }
            else {
                $scope.imageList[index] = (generateImage($scope.imageList[index].tweet,  $rootScope.image.pop(), $scope.username, $scope.justify, 0));
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
                        $rootScope.image = data;
                        console.log("Found images");
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
            // generateImage($scope.tempTweets[$scope.tweetCount], $rootScope.image[$scope.imageCount], $rootScope.username, $scope.justify, 0);     
            console.log("drawImage ");
            $scope.imageList.push(generateImage(tweet, $rootScope.image.pop(), $scope.username, $scope.justify, 0));
            $scope.afterImage();
        };
        $scope.afterImage = function(){
            $scope.imageStatus = '';
            $scope.showImages = true;
            $scope.timer = new Date() - $scope.timer;
            $scope.imagesLock = false
            console.log("Request handeled in " + $scope.timer + " milliseconds");   
        };
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
