'use strict';
/**
 * @ngdoc function
 * @name jadenSmithApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jadenSmithApp
 */


angular.module('jadenSmithApp')
.controller('MainCtrl', function($scope, $resource) {
  $scope.user = 'officialjaden';
  $scope.tweetList = null;
  $scope.imageList = null;
  $scope.currentTweet = 0;
  $scope.currentImage = 0;
  $scope.isSearch = false;

  $scope.getTweets = function(){
    $scope.tweetList = $resource("http://localhost:5000/tweets").get();
    $scope.isSearch = true;
    console.log($scope.isSearch);
  };

  $scope.newImage = function(){
    $scope.currentImage++;
    // Loop images
    if($scope.currentImage >= Object.keys($scope.imageList.images).length)
    {
      $scope.currentImage = 0;
    }
  };

  $scope.newTweet = function(){
    $scope.currentTweet++;
    // TODO: Fix for tweet structure
    // Tweets are listed on a frequency index, not an enumeration
    if($scope.currentTweet >= Object.keys($scope.tweetList.tweets).length)
    {
      $scope.currentTweet = 0;
    }
  };

  $scope.generateImage = function(){
    //console.log("Generate Image: " + $scope.imageList.images[$scope.currentImage]);
    var tweet = "test"; //$scope.tweetList.tweets[222];
    var image = $scope.imageList.images[$scope.currentImage];
    $scope.ImageGenerator.generate(tweet, "officialjaden", image, "CENTER");
  };

  /*
  $('#download').click(function(){
    var dataURL = document.getElementById("myCanvas").toDataURL('image/png');
    window.location.href=dataURL;
  })
  */

  $scope.ImageGenerator = {};
  $scope.ImageGenerator.init = function() {
    this.canvas = document.getElementById("myCanvas");
    this.context = this.canvas.getContext("2d");
    this.imageWidth = 400;
    this.imageHeight = 400;
    this.textPadding = 20;
  };

  $scope.ImageGenerator.generate = function(tweetText, authorText, imageSrc, justify) {
    console.log("Generate");
    console.log("Tweet: " + tweetText);
    console.log("Author: " + authorText);
    console.log("Image: " + imageSrc);

    var _this = this;
    _this.imageObj = new Image();
    _this.imageObj.crossOrigin = "anonymous";
    console.log("Image made");
    _this.imageObj.onload = function(){
      console.log("Generate onload");
      _this.context.drawImage(_this.imageObj, 0, 0, _this.imageWidth, _this.imageHeight);
      // not perfect formula...
      var fontSize = 80 - (tweetText.length / 2.5);
      var fonts = ["Arial", "Georgia", "Times New Roman"];
      var font = fonts[Math.floor(Math.random() * fonts.length)];
      _this.context.font = fontSize + "px " + font;
      _this.context.strokeStyle = getInverseColor(_this.canvas);
      _this.context.fillStyle = "white";

        // Write Text
      wrapText(_this.context, tweetText, _this.textPadding, 60, _this.imageWidth - (_this.textPadding * 2), fontSize, justify);
       _this.context.font = "30px " + font;
      var authorSize = _this.context.measureText(authorText);
      var width = 400 - authorSize.width - (_this.textPadding);
      // super non precise formula
      _this.context.lineWidth = fontSize /30;
      _this.context.fillText(authorText, width, 380);
    };
console.log("Generate End");
    _this.imageObj.src = imageSrc; 
  };

// From: http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight, justify) {
  console.log("wrapText");
  var words = text.split(' ');
  var line = '';
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, getX(justify, x, line, context), y);
      context.strokeText(line, getX(justify, x, line, context), y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, getX(justify, x, line, context), y);
  context.strokeText(line, getX(justify, x, line, context), y);

}
function getX(justify, x, line, context){
  switch(justify){
    case "LEFT":
      return x;  
    case "RIGHT":
      return $scope.ImageGenerator.imageWidth - x - context.measureText(line).width;         
    case "CENTER":
      return ($scope.ImageGenerator.imageWidth - x - context.measureText(line).width) / 2;      
    }
  }
function getHex(values){
    var red = values[0];
    var green = values[1];
    var blue = values[2];
    var rgb = blue | (green << 8) | (red << 16);
    return "#" + rgb.toString(16);
}
function invertColor(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
}
function getInverseColor(canvas){
  var colorThief = new ColorThief();
  var color = getHex(colorThief.getColor(canvas));
  return invertColor(color);
  //return "white";
}






  $scope.onSearchUser = function(){
    $scope.getTweets(/*user*/);
    $scope.generateImage();
  };

  $scope.onNewImage = function(){
    $scope.newImage();
    $scope.generateImage();
  };

  $scope.$on('$viewContentLoaded', function () {
    $scope.canvas = document.getElementById('myCanvas');
    $scope.context = $scope.canvas.getContext("2d");
    $scope.imageList = $resource("http://localhost:5000/images").get();
    $scope.getTweets();
    $scope.ImageGenerator.init();
    console.log($scope.imageList);
  });
});

