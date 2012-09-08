/*
Name: Fullscreen Library
Version: 1
Handled html5 fullscreen implementation.
*/

var cp = cp || {};

(function(cp, window) {
    cp.fullscreen = {
        _fullscreenButton: null,

        init: function() {
            document.fullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

            window.addEventListener("fullscreenchange", this.monitor, false);
            window.addEventListener("mozfullscreenchange", this.monitor, false);
            window.addEventListener("webkitfullscreenchange", this.monitor, false);

            this._fullscreenButton = document.getElementById('fullscreen-button');
            this._fullscreenButton.addEventListener('click', this.open, false);
        },

        monitor: function(e) {
            // if(document.fullscreen) {
            //     cp.core.canvas.width = 500;
            //     cp.core.canvas.height = 400;
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
