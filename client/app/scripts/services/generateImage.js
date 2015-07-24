//'use strict';

angular.module('jadenSmithApp')
.service('generateImage', ['getHex', 'invertColor', 'getInverseColor', function(getHex, invertColor, getX, getInverseColor) {
    
    function getFontSize(tweetText){
        return tweetText.length > 100 ? 160 - tweetText.length : 130 - tweetText.length
    }

    function genCSS(fontSize, justify){
        return "{'font-size': " + fontSize + ",'text-align': '" + justify + "'}"
    }
    return function(tweetText, imageSrc, authorText, justify) {
        var fontSize = getFontSize(tweetText);
        var imageObj = {};
        imageObj.css = genCSS(fontSize, justify);
        imageObj.tweet = tweetText;
        imageObj.image = imageSrc;
        imageObj.author = authorText;
        imageObj.justify = justify;
        
        return imageObj;
    };
}]);

