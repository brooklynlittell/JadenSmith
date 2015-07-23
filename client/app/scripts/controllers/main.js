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
        $scope.justify = "CENTER";
        $scope.tweetCount = 0;
        $scope.tempTweets = null;
        $scope.imageCount = 0;
        $scope.imageStatus = '';
        $scope.timer;
        $scope.imageList = new Array();
       
        $scope.init = function(){
        getImages().then(function(data){
            $rootScope.image = data;
            console.log("Found images");
            var urlParam = $location.search().username;
            if(urlParam){
                $scope.username = urlParam;
                $scope.onSearch();
                }  
            });
        }
        $scope.onSearch = function() {
            $scope.tweetCount  = 0;
            $scope.tempTweets = null;
            $scope.imageList = [];
            $rootScope.username = $scope.username;
            $location.search('username', $rootScope.username);
            $scope.imageStatus = 'loading.....'
            // async stuff (slightly broken for images)
            $scope.tweetCount = 0;
            console.log("Getting tweets");
            getTweets($rootScope.username).then(function(tweets){
                $scope.tempTweets = tweets;
                for (var tweet in tweets)
                {
                    $scope.timer = new Date();
                    $scope.newImage(tweets[tweet]);
                }
                //$scope.newImage();
            });
        };
        $scope.moreTweets = function() {
            $scope.timer = new Date();
            $scope.imageStatus = 'loading.....'
            // async stuff (slightly broken for images)
            getTweets($rootScope.username).then(function(tweets){
                $scope.tempTweets += tweets;
                for (var tweet in tweets)
                {
                    $scope.newImage(tweets[tweet]);
                }
                //$scope.newImage();
            });
        };
        // Events
        $scope.onNewImage = function(tweet){
            $scope.timer = new Date();
            console.log("Generating new image for " + tweet);
            $scope.newImage(tweet);
        };

        $scope.onNewJustify = function(justify, tweet){
            console.log("Generating new justification " + justify + " for " + tweet);
            $scope.justify = justify;
            generateImage(tweet, $rootScope.image[$scope.imageCount], $rootScope.username, $scope.justify, 0);
        };
        
        $scope.onDownload = function(id) {
            var dataURL = document.getElementById(id).toDataURL('image/png');
            $window.open(dataURL, '_blank');
        };

        // pulls the next image, or queries for more images, if necessary
        $scope.newImage = function(tweet) {         
            // if we need to get more images
            if ($scope.imageCount >= Object.keys($rootScope.image).length - 1 ) {
                console.log("No more images. Querying for more.");
                getImages().then(function(data) {
                    $rootScope.image = data;
                    console.log("Found images");
                    $scope.imageCount = 0;
                    $scope.drawImage(tweet);
                });
            }
            else {
                $scope.imageCount++;
                $scope.drawImage(tweet);
            }            
        };
        // actually calling the image generation class
        $scope.drawImage = function(tweet){
            
           /* if($scope.tweetCount >= $scope.tempTweets.length){
                console.log("Fetching more tweets");
                getTweets($rootScope.username).then(function(tweets){
                    $scope.tweetCount = 0;
                    $scope.tempTweets = tweets;
                    $scope.drawImage();
                });
            }
            */
            // generateImage($scope.tempTweets[$scope.tweetCount], $rootScope.image[$scope.imageCount], $rootScope.username, $scope.justify, 0);
         
            console.log("drawImage");
            $scope.imageList.push(generateImage(tweet, $rootScope.image[$scope.imageCount], $scope.username, $scope.justify, 0));
            $scope.imageStatus = '';
            $scope.showImages = true;
            $scope.timer = new Date() - $scope.timer;
            console.log("Request handeled in " + $scope.timer + " milliseconds");   
        };
    }
]);
// on page load 
app.run(function ($rootScope, $location, getImages){
   
});
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
