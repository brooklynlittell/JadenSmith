angular.module('jadenSmithApp')
.service('generateImage', ['getHex', 'invertColor', 'getX', 'getInverseColor', function(getHex, invertColor, getX, getInverseColor) {
   return function(tweetText, imageSrc, authorText, justify, count) {
   	init(count);
   	generate(tweetText, authorText, imageSrc, justify);
  }

  function init(count){
    var canvas = "myCanvas" + count;
    console.log("CANVAS: " + canvas)
  	this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
    this.imageWidth = 600;
    this.imageHeight = 600;
    this.textPadding = 20;
  }

  function generate(tweetText, authorText, imageSrc, justify){
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
      // not perfect formula..
      var percent = (tweetText.length + 5) / (180 - 1);
      var outputY = 140 - (percent * (140));
      var fontSize = outputY;
      fontSize = tweetText.length > 100 ? fontSize + fontSize* 1/5 : fontSize;
      fontSize = tweetText.length > 120 ? fontSize + fontSize* 1/5 : fontSize;

      _this.context.font = fontSize + "px Arial";
      _this.context.strokeStyle = getInverseColor(_this.canvas);
      _this.context.fillStyle = "white";

        // Write Text
      wrapText(_this.context, tweetText, _this.textPadding, _this.imageWidth - (_this.textPadding * 2), fontSize, justify, fontSize);
       _this.context.font = "30px Arial" ;
       authorText = "@" + authorText;
      var authorSize = _this.context.measureText(authorText);
      var width = 600 - authorSize.width - (_this.textPadding);
      // super non precise formula
      _this.context.lineWidth = fontSize /30;
      _this.context.fillText(authorText, width, 580);
    };
    console.log("Generate End");
    _this.imageObj.src = imageSrc; 
  }
  function wrapText(context, text, x, maxWidth, lineHeight, justify, fontSize) {
    console.log("Wrapping text");
    var words = text.split(' ');
    var line = '';
    var y = lineHeight
    var oldFontSize = fontSize;
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      fontSize = oldFontSize;
      context.font = fontSize + "px Arial";
      if (testWidth > maxWidth && n > 0) {
        while (context.measureText(line).width > 600){
          fontSize--;
          context.font = fontSize + "px Arial" ;
        }
        context.fillText(line, getX(justify, x, line, context), y);
        context.strokeText(line, getX(justify, x, line, context), y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    while (context.measureText(line).width > 550){
        fontSize--;
        context.font = fontSize + "px Arial" ;
      }
    context.fillText(line, getX(justify, x, line, context), y);
    context.strokeText(line, getX(justify, x, line, context), y);
  }
 }]);

