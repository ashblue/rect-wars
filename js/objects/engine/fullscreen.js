/*
Name: Fullscreen Library
Version: 1
Handled html5 fullscreen implementation.
*/

var cp = cp || {};

(function(cp, window) {
    var WINDOW = Sizzle('window');

    cp.fullscreen = {
        init: function() {
            document.fullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

            window.addEventListener("fullscreenchange", this.monitor, false);
            window.addEventListener("mozfullscreenchange", this.monitor, false);
            window.addEventListener("webkitfullscreenchange", this.monitor, false);
        },

        monitor: function(e) {
            if(document.fullscreen) {
                cp.core.canvas.style.width = '80%';
                cp.core.canvas.style.height = '80%';
            }
            else {
                cp.core.canvas.style.width = '80%';
                cp.core.canvas.style.height = '80%';
            }
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
                cp.core.canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        },

        openIfOptionSet: function() {
            var optionSetting =
                myDB.getTableData('options', 'info', 'automatic fullscreen');
            if (!optionSetting) {
                return;
            }

            this.open();
        }
    };

    cp.fullscreen.init();
}(cp, window));
