/**
 * @requires 'models/.js'
 */
(function(cp) {
    /** @type {number} Cached reference of game's play area */
    var _gameWidth = null;

    /** @type {number} Amount of padding to give the camera while scrolling */
    var _cameraPanPadding = 70;

    /** @type {number} Amount of shots required to fill the special bar */
    var _specialMax = 10;

    /** @type {number} Current number of shots for the special bar */
    //var _specialCount = 0;
    var _specialCount = 0;

    var _private = {
        generateParticle: function (Player, Continue, color) {
            return {
                x: Player.x,
                y: Player.y,
                xPush: cp.math.random(Continue.particleSpeed) * cp.math.randomPosNeg() * 0.1,
                yPush: cp.math.random(Continue.particleSpeed) * cp.math.randomPosNeg() * 0.1,
                color: color
            };
        }
    };

    cp.template.Player = cp.template.Entity.extend({
        type: 'a',
        width: 20,
        height: 20,
        speed: 3.5,
        color: '#f00',
        player: true, // Do not remove, used for search functionality elsewhere
        bulletSpeed: 0.3, // Time in seconds between bullets fired
        hp: 1,
        deathCount: 0,

        offset: {
            x: -25,
            y: -20
        },

        init: function (x, y) {
            if (_gameWidth === null) {
                _gameWidth = cp.core.gameWidth;
            }

            // Set player's position manually
            if (x !== undefined) {
                this.x = x;
                this.y = y;

            // Center the player by default
            } else {
                this.x = (_gameWidth / 2) - (this.width / 2);
                this.y = cp.core.height - (this.height * 4);
            }

            this.delay = new cp.timer(this.bulletSpeed);

            this.animSheet = new cp.animate.sheet('player.png', 71, 108);

            // Forward animations
            this.animForward = new cp.animate.cycle(this.animSheet, 0.07, [0, 1], true);
            this.animIdle = new cp.animate.cycle(this.animSheet, 0.09, [2, 3], true);
            this.animBack = new cp.animate.cycle(this.animSheet, 0.1, [4]);

            // Side animations
            this.animSideForward = new cp.animate.cycle(this.animSheet, 0.07, [5, 6], true);
            this.animSideIdle = new cp.animate.cycle(this.animSheet, 0.09, [7, 8], true);
            this.animSideBack = new cp.animate.cycle(this.animSheet, 0.1, [9]);

            this.animSet = this.animIdle;

            // Set boundaries
            this.boundaryRight = _gameWidth - this.width;
            this.boundaryBottom = cp.core.height - this.height;

            // Cached number for shooting position
            this.xMiddle = this.width / 2;
        },

        /**
         * @todo The keyboard input for directions really needs to be optimized
         */
        update: function () {
            this._super();

            if (this.hp <= 0) {
                this.kill();
                return;
            }

            // Up and left
            if (cp.input.press('up') && cp.input.press('left') && this.y > 0 && this.x > 0) {
                this.animSet = this.animSideForward;
                this.y -= this.speed;
                this.x -= this.speed;

            // Up and right
            } else if (cp.input.press('up') && cp.input.press('right') && this.y > 0 && this.x < this.boundaryRight) {
                this.animSet = this.animSideForward;
                this.y -= this.speed;
                this.x += this.speed;

            // Down and left
            } else if (cp.input.press('down') && cp.input.press('left') && this.x > 0 && this.y < this.boundaryBottom) {
                this.animSet = this.animSideBack;
                this.y += this.speed;
                this.x -= this.speed;

            // Down and right
            } else if (cp.input.press('down') && cp.input.press('right') && this.x < this.boundaryRight && this.y < this.boundaryBottom) {
                this.animSet = this.animSideBack;
                this.y += this.speed;
                this.x += this.speed;

            // Left
            } else if (cp.input.press('left') && this.x > 0) {
                this.animSet = this.animSideIdle;
                this.x -= this.speed;

            // Right
            } else if (cp.input.press('right') && this.x < this.boundaryRight) {
                this.animSet = this.animSideIdle;
                this.x += this.speed;

            // Up
            } else if (cp.input.press('up') && this.y > 0) {
                this.animSet = this.animForward;
                this.y -= this.speed;

            // Down
            } else if (cp.input.press('down') && this.y < this.boundaryBottom) {
                this.animSet = this.animBack;
                this.y += this.speed;

            // Idle
            } else {
                this.animSet = this.animIdle;
            }

            // Check if the direction has flipped
            if (this.x > this.xLast) {
                this.flip.x = true;
            } else {
                this.flip.x = false;
            }

            // Make camera semi-follow player, includes extra logic to prevent a camera crash if the player dies while the camera moves
            if ((this.x + _cameraPanPadding > cp.camera.x + cp.core.width) || (this.x - _cameraPanPadding < cp.camera.x)) {
                var cameraX = cp.camera.x - (this.xLast - this.x);
                if (!isNaN(cameraX)) {
                    cp.camera.setPosition(cameraX, 0);
                }
            }

            this.xLast = this.x;

            // Shoot
            if (cp.input.press('shoot') && this.delay.expire()) {
                cp.game.spawn('Laser', this.x + this.xMiddle, this.y);
                this.delay.reset();
            } else if (cp.input.down('special') && this.delay.expire() && _specialCount >= _specialMax) {
                cp.game.spawn('Bomb', this.x, this.y);
                this.delay.reset();
                _specialCount = 0;
            }
        },

        collide: function () {
            this.hit = true;
            this.kill();
            ++this.deathCount;
        },

        kill: function () {
            // Increment deaths stat, id - 6
            cp.stats.incrementData(6);

            cp.game.spawn('Continue', this);
            this._super();
        }
    });

    cp.template.Continue = cp.template.Entity.extend({
        /** @type {array} Storage container for all array particles */
        particles: null,
        particleBlue: 16,
        particleGray: 27,
        particleWhite: 44,
        particleSize: 4,
        particleSpeed: 100,
        particleReverseDelay: 0.4,
        playerSpawnDelay: 0.8,
        reversed: false,

        xPlayer: null,
        yPlayer: null,

        init: function (Player) {
            var self = this;

            // Set player position
            this.xPlayer = Player.x;
            this.yPlayer = Player.y;

            this.particles = [];

            // Create blue particles
            for (var i = this.particleBlue; i--;) {
                this.particles.push(_private.generateParticle(Player, this, '#209bec'));
            }

            // Create gray particles
            for (i = this.particleBlue; i--;) {
                this.particles.push(_private.generateParticle(Player, this, '#c1c1c1'));
            }

            // Create white particles
            for (i = this.particleBlue; i--;) {
                this.particles.push(_private.generateParticle(Player, this, '#f5f5f5'));
            }

            // Create reverse timer
            this.delayReverse = new cp.timer(this.particleReverseDelay);

            // Create spawn delay timer
            this.delaySpawnPlayer = new cp.timer(this.playerSpawnDelay);
        },

        update: function () {
            if (this.delaySpawnPlayer.expire()) {
                this.kill();
                cp.game.spawn('Player', this.xPlayer, this.yPlayer);
            } else if (!this.reversed && this.delayReverse.expire()) {
                for (var i = this.particles.length; i--;) {
                    this.particles[i].xPush = this.particles[i].xPush * -1;
                    this.particles[i].yPush = this.particles[i].yPush * -1;
                }
                this.reversed = true;
            }
        },

        draw: function () {
            for (var i = this.particles.length; i--;) {
                cp.ctx.fillStyle = this.particles[i].color;
                this.particles[i].x += this.particles[i].xPush;
                this.particles[i].y += this.particles[i].yPush;
                cp.ctx.fillRect(this.particles[i].x, this.particles[i].y, this.particleSize, this.particleSize);
            }
        }
    });

    cp.template.Laser = cp.template.Entity.extend({
        type: 'a',
        width: 2,
        height: 14,
        speed: 5,
        color: '#aaa',

        init: function(x, y) {
            this.x = x;
            this.y = y;

            // Increment bullets fired stat, id - 3
            cp.stats.incrementData(3);
        },

        update: function() {
            this.y -= this.speed;

            // Kill bullet if it goes outside the boundaries
            if (this.y - this.height < 0)
                this.kill();
        },

        draw: function() {
            // Placeholder image
            cp.ctx.fillStyle = this.color;
            cp.ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
        },

        collide: function(object) {
            object.hp -= 1;
            _specialCount += 1;
            this.kill();
        }
    });

    cp.template.SpecialUI = cp.template.Entity.extend({
        padding: 15,
        height: 13,
        colorBorder: '#d1d1d1',
        colorBackground: '#323232',
        colorFill: '#1d8ad1',
        colorReady: '#48b7ff',
        delayColorToggle: 0.5,

        init: function () {
            this.width = cp.core.width - (this.padding * 2);
            this.timerColorToggle = new cp.timer(this.delayColorToggle);
        },

        update: function() {

        },

        draw: function() {
            // Draw background
            cp.ctx.fillStyle = this.colorBackground;
            cp.ctx.strokeStyle = this.colorBorder;
            cp.ctx.fillRect(this.padding + cp.camera.x, this.padding + cp.camera.y, this.width, this.height);
            cp.ctx.strokeRect(this.padding + cp.camera.x, this.padding + cp.camera.y, this.width, this.height);

            if (_specialCount === 0) {
                return;
            }

            // Create fill size
            var widthFill = this.width * (_specialCount / _specialMax);

            // Flash fill when ready
            if (widthFill >= this.width) {
                widthFill = this.width;
                if (this.timerColorToggle.expire()) {
                    this.colorReady = (this.colorReady === this.colorFill ? '#48b7ff' : this.colorFill);
                    this.timerColorToggle.reset();
                }

                cp.ctx.fillStyle = this.colorReady;

            // Draw fill noramlly
            } else {
                cp.ctx.fillStyle = this.colorFill;
            }

            // Output fill
            cp.ctx.fillRect(this.padding + cp.camera.x + 3, this.padding + cp.camera.y + 3, widthFill - 6 , this.height - 6);
        }
    });
}(cp));
