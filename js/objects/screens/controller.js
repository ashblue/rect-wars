/**
 * @todo Logo should probably be animated and an actual image sprite
 * @todo Remove sizzle, not necessary
 * @todo Prevent default up, down, left, and right
 */
(function (cp) {
    /** @type {object} DOM element for the intro screen */
    var INTRO_SCREEN = Sizzle('#screen-intro')[0];

    /** @type {array} All intro screen links */
    var LINKS = Sizzle('#screen-intro a');

    /** @type {array} All modals that contain intro screen information */
    var SCREENS = Sizzle('.screen-modal');

    /** @type {object} Currently active DOM screen */
    var _activeScreen = Sizzle('#screen-home')[0];

    /** @type {object} Image object */
    var _logoImg = null;

    /** @type {boolean} Decides if the logo should or shouldn't be drawn */
    var _logoRdy = false;

    /** @type {number} X point to draw the logo at the center */
    var _logoCenterX = null;

    /** @type {object} DOM container for scrolling credits */
    var _creditScroll = document.getElementById('credit-scroll');

    /** @type {object} DOM outer div for scrolling */
    var _creditScrollOuter = document.getElementById('credit-roll');

    /** @type {timer} Contains the timer for credits */
    var _creditTimer = null;

    var _private = {
        startCredits: function () {
            _creditScroll.style.marginTop = 0;
            var heightMax = _creditScroll.clientHeight + _creditScrollOuter.clientHeight;

            _creditTimer = window.setInterval(function () {
                var marginTop = parseFloat(_creditScroll.style.marginTop) - 1;
                if (marginTop <= -heightMax) {
                    _private.stopCredits();
                }

                _creditScroll.style.marginTop = marginTop.toString() + 'px';
            }, 20);
        },

        stopCredits: function () {
            window.clearInterval(_creditTimer);
        }
    };

    var _events = {
        navigate: function (e) {
            e.preventDefault();

            // Navigate to a specific target
            var navId = this.dataset.nav;
            if (navId !== undefined) {
                // Hide all modals
                for (var i = SCREENS.length; i--;) {
                    SCREENS[i].classList.add('hide');
                }

                // Show the nav target and set the cursor to the top
                _activeScreen = Sizzle('#' + navId)[0];
                var links = _activeScreen.getElementsByClassName('screen-nav-link');
                for (var i = links.length; i--;) {
                    links[i].classList.remove('active');
                }
                links[0].classList.add('active');

                _activeScreen.classList.remove('hide');
            }

            // Scrolling command?
            var creditsCommand = this.dataset.credits;
            if (creditsCommand === 'start') {
                _private.startCredits();
            } else if (creditsCommand === 'stop') {
                _private.stopCredits();
            }
        },

        hover: function (e) {
            var links = _activeScreen.getElementsByClassName('screen-nav-link');
            for (var i = links.length; i--;) {
                links[i].classList.remove('active');
            }
            e.target.classList.add('active');
        },

        stopScrolling: function (e) {
            e.preventDefault();
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
            if (cp.input.down('down')) {
                // Get all links
                var links = _activeScreen.getElementsByClassName('screen-nav-link'),
                    replaceNext = null;
                for (var i = 0; i < links.length; i++) {
                    if (links[i].className === 'screen-nav-link active' && i !== links.length - 1) {
                        links[i].classList.remove('active');
                        replaceNext = true;
                    } else if (replaceNext === true) {
                        return links[i].classList.add('active');
                    }
                }
            } else if (cp.input.down('up')) {
                var links = _activeScreen.getElementsByClassName('screen-nav-link'),
                    replaceNext = null;
                for (var i = links.length; i--;) {
                    if (links[i].className === 'screen-nav-link active' && i !== 0) {
                        links[i].classList.remove('active');
                        replaceNext = true;
                    } else if (replaceNext === true) {
                        return links[i].classList.add('active');
                    }
                }
            } else if (cp.input.down('submit') || cp.input.down('space')) {
                // get active link and click it
                _activeScreen
                    .getElementsByClassName('screen-nav-link active')[0]
                    .click();
            }

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
                LINKS[i].addEventListener('mouseover', _events.hover);
            }

            window.addEventListener('keydown', _events.stopScrolling);
        },

        /**
         * Destroy all events that have been binded, fired in the kill() method
         */
        unbind: function () {

        }
    });
}(cp));