//'use strict';

angular.module('jadenSmithApp')
.service('generateImage', ['getHex', 'invertColor', 'getInverseColor', function(getHex, invertColor, getX, getInverseColor) {
    
    function getFontSize(tweetText){
        if(tweetText.length < 60) 180 - tweetText.length;
        else if (tweetText.length < 80) 160 - tweetText.length;
        else if (tweetText.length < 100) 130 - tweetText.length;
        else 120 - tweetText.length;
    }

    function genCSS(fontSize, justify){
        return "{'font-size': " + fontSize + ",'text-align': '" + justify + "'}"
    }
    return function(tweetText, imageSrc, authorText, justify) {
        var fontSize = getFontSize(tweetText);
        console.log(tweetText + " " + tweetText.length);
        var imageObj = {};
        imageObj.css = genCSS(fontSize, justify);
        imageObj.tweet = tweetText;
        imageObj.image = imageSrc;
        imageObj.author = authorText;
        imageObj.justify = justify;
        
        return imageObj;
    };
}]);

