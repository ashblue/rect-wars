/**
 * @todo Logo should probably be animated and an actual image sprite
 */
(function (cp) {
    /** @type {object} DOM element for the intro screen */
    var INTRO_SCREEN = Sizzle('#screen-intro')[0];

    /** @type {array} All intro screen links */
    var LINKS = Sizzle('#screen-intro a');

    /** @type {array} All modals that contain intro screen information */
    var SCREENS = Sizzle('.screen-modal');

    /** @type {object} Image object */
    var _logoImg = null;

    /** @type {boolean} Decides if the logo should or shouldn't be drawn */
    var _logoRdy = false;

    /** @type {number} X point to draw the logo at the center */
    var _logoCenterX = null;

    var _events = {
        navigate: function (e) {
            e.preventDefault();

            // Get the target
            var navId = this.dataset.nav;
            if (navId !== undefined) {
                // Hide all modals
                for (var i = SCREENS.length; i--;) {
                    SCREENS[i].classList.add('hide');
                }

                // Show the nav target
                console.log(Sizzle('#' + navId));
                Sizzle('#' + navId)[0].classList.remove('hide');
            }
        }
    };

    cp.template.Screens = cp.template.Entity.extend({
        name: 'screen',
        width: cp.core.width,
        height: cp.core.height,

        init: function () {
            // Show intro screen
            INTRO_SCREEN.classList.remove('hide');

            // Setup all navigation
            this.bind();

            // Get the logo setup
            _logoImg = new Image();
            _logoImg.src = 'images/logo.png';
            _logoImg.onload = function (e) {
                // Start drawing the logo
                _logoRdy = true;

                // Center the logo
                _logoCenterX = (cp.core.width - _logoImg.width) / 2;
            };
        },

        update: function () {
            return;
        },

        draw: function () {
            if (_logoRdy) {
                cp.ctx.drawImage(_logoImg, _logoCenterX, 75);
            }
        },

        /**
         * Bind all events
         */
        bind: function () {
            for (var i = LINKS.length; i--;) {
                LINKS[i].addEventListener('click', _events.navigate);
            }
        },

        /**
         * Destroy all events that have been binded, fired in the kill() method
         */
        unbind: function () {

        }
    });
}(cp));