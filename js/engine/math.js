/*
Name: Math processing
Version: 1
Desc: Contains a library of pre-built math equations, very
useful for generating random numbers and simplifying other
complex logic.
*/

var cp = cp || {};

cp.math = {
    // Random should only be run in the init for best practice
    random: function(max, min) {
        if (!min) min = 1;
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    
    // Returns a random positive or negative number
    randomPosNeg: function() {
        return Math.random() < 0.5 ? -1 : 1;
    },
    
    // Number converter
    // val = the number you wish to convert such as 5 (5 milliseconds)
    // base = the number to divide it by 1000 (conversion to a second)
    // round = how many numbers should it round up the returned result?
    // multiply = boolean that allows you to convert a number down instead of up
    convert: function(val, base, round, multiply) {
        // Convert a number up
        if (multiply) {
            var total = val * base;
        // Convert down
        } else {
            var total = val / base;
        }
        
        return Math.round(total * Math.pow(10, round)) / Math.pow(10, round);
    },
    
    // Returns the angle between two points (in radians)
    angle: function(x1, y1, x2, y2) {
        var diff_x = (x1 - x2) * -1;
        var diff_y = (y1 - y2) * -1;
        
        return Math.atan2(diff_y,diff_x);
    },
    
    // Returns the distance between two points.
    distance: function(x1, y1, x2, y2) {
        var diff_x = (x1 - x2) * -1;
        var diff_y = (y1 - y2) * -1;
        
        return Math.sqrt( (diff_x * diff_x) + (diff_y * diff_y));
    }
};