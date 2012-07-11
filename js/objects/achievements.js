/*
Name: Achievement Module
Dependency: storage.js
Version: 1
Desc: Allows users to create new animation sheets and control them.

TODO:
- Needs several achievement to test with vai JSON
  Ex. achieveInfo = {
    name: 'Mark of the noob',
    info: 'Short chunk of info on how this is achieved',
    unlocked: null,
    count: 0,
    progress: function(points) {
        if (unlocked !== null) return;
    
        if (points < 10) {
            this.count += points;
        } else {
            // Fires an unlocking mechanism from cp.achievements
        }
    }
  };
- Needs to generate an achievement object that pops up in the bottom right
- Needs to generaete a list of achievements that can be scrolled

Logic:
- Unstringify existing achievements at load and apply them to the existing achievement tree
- When a new achievement is unlocked, the entire storage object must be appended with newly stringified unlock data
- Standardized achievement unlock method
*/

var cp = cp || {};

(function(cp) {
    cp.achievements = {  
        init: function () {
            //
        }  
    };
}(cp));