'use strict';

angular.module('jadenSmithApp')
.service('getHex', [function() {
    return function(values) {
        var red = values[0];
        var green = values[1];
        var blue = values[2];
        var rgb = blue | (green << 8) | (red << 16);
        return "#" + rgb.toString(16);
    };
}])
.service('getX', [function(){
    return function(justify, x, line, context) {
        switch(justify){
            case "LEFT":
                return x;  
            case "RIGHT":
                return this.imageWidth - x - context.measureText(line).width;         
            case "CENTER":
                return (this.imageWidth - context.measureText(line).width) / 2;      
        }
    };
}])
.service('invertColor', [function(){
    return function(hexTripletColor) {
        var color = hexTripletColor;
        color = color.substring(1);           // remove #
        color = parseInt(color, 16);          // convert to integer
        color = 0xFFFFFF ^ color;             // invert three bytes
        color = color.toString(16);           // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color;                  // prepend #
        return color;
    };
}])
.service('getInverseColor', ['invertColor', 'getHex', function(invertColor, getHex){
    return function(canvas) {
        var colorThief = new ColorThief();
        var color = getHex(colorThief.getColor(canvas));
        return invertColor(color);
    };
}]);
