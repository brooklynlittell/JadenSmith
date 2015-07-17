angular.module('jadenSmithApp')
.service('generateImage', [function() {
   return function(tweetText, imageSrc, authorText, justify, count) {
   	init(count);
   	generate(tweetText, authorText, imageSrc, justify);
  }

  function init(count){
    var canvas = "myCanvas" + count;
    console.log("CANVAS: " + canvas)
  	this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
    this.imageWidth = 400;
    this.imageHeight = 400;
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
       authorText = "@" + authorText;
      var authorSize = _this.context.measureText(authorText);
      var width = 400 - authorSize.width - (_this.textPadding);
      // super non precise formula
      _this.context.lineWidth = fontSize /30;
      _this.context.fillText(authorText, width, 380);
    };
    console.log("Generate End");
    _this.imageObj.src = imageSrc; 
  }
  function wrapText(context, text, x, y, maxWidth, lineHeight, justify) {
    console.log("Wrapping text");
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
      return this.imageWidth - x - context.measureText(line).width;         
    case "CENTER":
      return (this.imageWidth - x - context.measureText(line).width) / 2;      
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
  }
 }]);

