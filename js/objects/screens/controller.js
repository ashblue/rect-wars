/**
 * @todo Logo should probably be animated and an actual image sprite
 * @todo Remove sizzle, not necessary
 * @todo Prevent default up, down, left, and right
 */
(function (cp) {
    /** @type {object} Reference to the screen CP entity */
    var SELF = null;

    /** @type {object} Background entity */
    var BACKGROUND = null;

    /** @type {object} DOM element for the intro screen */
    var INTRO_SCREEN = Sizzle('#screen-intro')[0];

    /** @type {array} All intro screen links */
    var LINKS = null;

    /** @type {array} All modals that contain intro screen information */
    var SCREENS = Sizzle('.screen-modal');

    /** @type {object} DOM element used to scroll the history table */
    var HISTORY_CONTAINER = document.getElementById('history-table-scroll');

    /** @type {object} DOM navigation counter for history table */
    var HISTORY_NAV = document.getElementById('history-nav');

    /** @type {object} DOM element used to scroll achievement items */
    var ACHIEVEMENT_CONTAINER = document.getElementById('achievements-scroll');

    /** @type {object} DOM navigation counter for achievements */
    var ACHIEVEMENT_NAV = document.getElementById('achievements-nav');

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
        /**
         * Runs the credit scrolling and sets the default starting position
         */
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

        /**
         * Ends the credit scrolling
         */
        stopCredits: function () {
            window.clearInterval(_creditTimer);
        },

        /**
         * Creates the navigation text for history and achievements
         * @param {object} elTarget DOM element where text should be re-placed
         * @param {array} elSource
         * @param {number} increment How much does the nav increment each time somebody
         * scrolls?
         * @returns {undefined}
         */
        setNavNumbers: function (elTarget, elSource, increment) {
            elTarget.innerHTML = '1 - ' + increment + ' of ' + elSource.length;
        }
    };

    /** @type {object} Scripts that can be run through a data-script attribute */
    var _scripts = {
        startLv1: function () {
            console.log('lv 1 start logic here');

            // Cleanup logic
            SELF.kill();
            SELF = null;
            BACKGROUND.kill();
            BACKGROUND = null;

            // Run the actual level
            cp.game.spawn('Level1');
        },

        comingSoon: function () {
            alert('We\'re currently working on levels 2 and 3, check back soon');
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

        runScript: function (e) {
            e.preventDefault();

            var scriptName = this.dataset.script;
            _scripts[scriptName]();
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
        },

        scrollContainer: function (e) {
            e.preventDefault();

            // Get the target
            var target = document.getElementById(e.target.dataset.target);

            // Get the target's attributes we need for scrolling
            var height = parseInt(target.parentElement.style.height, 10);
            var marginTop = parseInt(target.style.marginTop, 10) || 0;

            // Depending upon the direction, scroll up or down
            if (e.target.dataset.direction === 'down' && marginTop > -parseInt(target.parentElement.dataset.maxheight, 10) - marginTop) {
                target.style.marginTop = -height + marginTop + 'px';
            } else if (e.target.dataset.direction === 'up' && marginTop !== 0) {
                target.style.marginTop = height + marginTop + 'px';
            }

            // Update the nav counter
        }
    };

    cp.template.Screens = cp.template.Entity.extend({
        name: 'screen',
        width: cp.core.width,
        height: cp.core.height,

        init: function () {
            SELF = this;
            BACKGROUND = cp.game.entityGetVal('id', cp.game.spawn('Background'))[0];

            // Show intro screen
            INTRO_SCREEN.classList.remove('hide');

            // Get the logo setup
            _logoImg = new Image();
            _logoImg.src = 'images/logo.png';
            _logoImg.onload = function (e) {
                // Start drawing the logo
                _logoRdy = true;

                // Center the logo
                _logoCenterX = (cp.core.width - _logoImg.width) / 2;
            };

            // Get levels and give them a disabled class if they aren't available
            var levelData = myDB.getTable('levels');
            var levelItems = Sizzle('#screen-intro a[data-script]');
            for (var i = 0; i < levelData.length; i++) {
                if (levelData[i].unlocked === false) {
                    levelItems[i].classList.add('disabled');
                }
            }

            // Get character history items and output them
            var statData = myDB.getTable('stats');
            var statTable = document.getElementById('history-table');
            var lineItem, lineTitle, lineData;
            for (i = 0; i < statData.length; i++) {
                lineItem = document.createElement('tr');

                lineTitle = document.createElement('td');
                lineTitle.innerHTML = statData[i].info;
                lineItem.appendChild(lineTitle);

                lineData = document.createElement('td');
                lineData.innerHTML = statData[i].data;
                lineItem.appendChild(lineData);

                statTable.appendChild(lineItem);
            }

            // Get achievements and output them
            var achieveData = myDB.getTable('achievements');
            var achieveList = document.getElementById('achievements');
            for (i = 0; i < achieveData.length; i++) {
                lineItem = document.createElement('li');
                lineItem.classList.add('achievement-item');

                // Add active class if its unlocked
                if (achieveData[i].unlocked === true) {
                    lineItem.classList.add('active');
                }

                lineTitle = document.createElement('span');
                lineTitle.classList.add('achievement-title');
                lineTitle.innerHTML = achieveData[i].name;
                lineItem.appendChild(lineTitle);

                lineData = document.createElement('span');
                lineData.classList.add('achievement-desc');
                lineData.innerHTML = achieveData[i].desc;
                lineItem.appendChild(lineData);

                achieveList.appendChild(lineItem);
            }

            // Get options
            var optionData = myDB.getTable('options');
            var optionList = Sizzle('#screen-options ul')[0];
            var optionListFirst = optionList.firstChild;
            for (i = 0; i < optionData.length; i++) {
                lineItem = document.createElement('li');
                lineItem.classList.add('screen-nav-item');

                lineTitle = document.createElement('a');
                lineTitle.classList.add('screen-nav-link');
                lineTitle.innerHTML = optionData[i].info + ' | ';
                lineTitle.setAttribute('href', '#');
                lineItem.appendChild(lineTitle);

                lineData = document.createElement('span');
                lineData.classList.add('option-state');
                if (optionData[i].data === true) {
                    lineData.innerHTML = 'on';
                } else {
                    lineData.innerHTML = 'off';
                }
                lineTitle.appendChild(lineData);

                optionList.insertBefore(lineItem, optionListFirst);
            }

            // Declare all link items here since they've been successfully created
            LINKS = Sizzle('#screen-intro a');

            // Set height of history table and nav text
            var tableLine = Sizzle('#history-table tr');
            var tableContainer = document.getElementById('history-table-container');
            tableContainer.style.height = tableLine[0].clientHeight * 5 + 'px';
            tableContainer.dataset.maxheight = tableLine[0].clientHeight * tableLine.length;
            _private.setNavNumbers(HISTORY_NAV, tableLine, 5);

            // Set height of achievements
            var achLine = document.getElementsByClassName('achievement-item');
            ACHIEVEMENT_CONTAINER.parentElement.style.height = achLine[0].clientHeight * 3 + 20 * 3 + 'px'; // For some odd reason the height isn't reporting back correctly
            ACHIEVEMENT_CONTAINER.parentElement.dataset.maxheight = achLine[0].clientHeight * achLine.length + (20 * achLine.length);
            _private.setNavNumbers(ACHIEVEMENT_NAV, achLine, 3);

            // Setup all navigation
            this.bind();

            // Hide everything except first item, do this last so heights can be retreived
            var modals = document.getElementsByClassName('screen-modal');
            for (i = 1; i < modals.length; i++) {
                modals[i].classList.add('hide');
            }
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

            return;
        },

        /**
         * Bind all events
         */
        bind: function () {
            // Attach proper even listeners to all links
            for (var i = LINKS.length; i--;) {
                // Logic for running scripts via data attribute
                if (LINKS[i].dataset.script) {
                    LINKS[i].addEventListener('click', _events.runScript);

                // Add scrolling to mini navs
                } else if (LINKS[i].dataset.direction) {
                    LINKS[i].addEventListener('click', _events.scrollContainer);

                // Set click to navigate events where necessary
                } else {
                    LINKS[i].addEventListener('click', _events.navigate);
                }

                LINKS[i].addEventListener('mouseover', _events.hover);
            }

            //window.addEventListener('keydown', _events.stopScrolling);
        },

        /**
         * Destroy all events that have been binded, fired in the kill() method
         */
        unbind: function () {
            //for (var i = LINKS.length; i--;) {
            //    if (LINKS[i].dataset.script) {
            //        LINKS[i].addEventListener('click', _events.runScript);
            //    } else {
            //        LINKS[i].addEventListener('click', _events.navigate);
            //    }
            //
            //    LINKS[i].addEventListener('mouseover', _events.hover);
            //}

            cp.input.unbindAll();
        },

        kill: function () {
            INTRO_SCREEN.classList.add('hide');

            this.unbind();

            this._super();
        }
    });
}(cp));