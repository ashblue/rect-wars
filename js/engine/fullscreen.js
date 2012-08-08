/*
Name: Input monitoring and library
Version: 1
Desc: Handles all keyboard input by storing results inside an array that can be
checked and cleared. This is the only design patter that allows multiple keys to
be checked at one time.

Note: Needs to be self contained keyboard events that are created and/or destroyed. Right now its
super jacked up because all the events fire to the same place. Should just let users setup their
own keyboard events with an object that can be destroyed or created.
*/

var cp = cp || {};

cp.fullscreen = {
    init: function() {
        document.fullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

        document.addEventListener("fullscreenchange", this.monitor, false);
        document.addEventListener("mozfullscreenchange", this.monitor, false);
        document.addEventListener("webkitfullscreenchange", this.monitor, false);
    },

    monitor: function(e) {
        // Used if the fullscreen open functionality is placed on the container
        // if(document.fullscreen) {
        //     var rect = cp.core.canvas.getBoundingClientRect();
        //     cp.core.canvas.width = rect.width;
        //     cp.core.canvas.height = rect.height;
        // }
        // else {
        //     cp.core.canvas.width = 500;
        //     cp.core.canvas.height = 400;
        // }
    },

    close: function(e) {
        if (cp.core.canvas.exitFullscreen) {
            cp.core.canvas.exitFullscreen();
        }
        else if (cp.core.canvas.mozCancelFullScreen) {
            cp.core.canvas.mozCancelFullScreen();
        }
        else if (cp.core.canvas.webkitCancelFullScreen) {
            cp.core.canvas.webkitCancelFullScreen();
        }
    },

    open: function(e) {
        if (cp.core.canvas.requestFullscreen) {
            cp.core.canvas.requestFullscreen();
        }
        else if (cp.core.canvas.mozRequestFullScreen) {
            cp.core.canvas.mozRequestFullScreen();
        }
        else if (cp.core.canvas.webkitRequestFullScreen) {
            cp.core.canvas.webkitRequestFullScreen();
        }
    }
};

cp.fullscreen.init();
