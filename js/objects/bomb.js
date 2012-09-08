(function(cp) {
    var _private = {

    };

    cp.template.Bomb = cp.template.Entity.extend({
        type: 'a',
        width: 18,
        height: 20,
        speed: 4,
        offset: {
            x: -5,
            y: -6
        },

        init: function (x, y) {
            // Setup animation
            this.animSheet = new cp.animate.sheet('labomba.png', 27, 41);
            this.animRotate = new cp.animate.cycle(this.animSheet, 0.07, [0, 1, 2, 3], true);
            this.animSet = this.animRotate;

            // Set size
            this.x = x;
            this.y = y;

            // Set boundaries
            this.boundaryTop = -this.animSheet.frameH;

            // Cached number for shooting position
            this.xMiddle = this.width / 2;

            // Explosion trigger delay
            this.timerExplodeDelay = new cp.timer(0.2);
        },

        update: function () {
            this._super();

            this.y -= this.speed;

            if (this.y < this.boundaryTop) {
                console.log('bomb dead');
                this.kill();
            } else if (cp.input.down('special') && this.timerExplodeDelay.expire()) {
                cp.game.spawn('BombExplosion', this);
                this.kill();
            }
        },

        collide: function (object) {
            if (object.name === 'bullet') {
                return;
            }

            console.log('bomb dead');
            cp.game.spawn('BombExplosion', this);
            this.kill();
        }
    });

    cp.template.BombExplosion = cp.template.Entity.extend({
        type: 'a',
        widthMax: 500,
        heightMax: 500,
        expirationTime: 2,
        particleStorage: null,
        particleCursor: 0,
        particleCursorLimit: null,

        init: function (bombParent) {
            var self = this;

            // Calculate explosion position
            this.x = this.xStart = bombParent.xMiddle + bombParent.x - (this.widthMax / 2);
            this.y = this.yStart = bombParent.y - (this.heightMax / 2);

            // Calculate number of particles and generate them
            this.particleCount = Math.round(this.widthMax / 2);
            this.particleStorage = [];
            for (var i = this.particleCount; i--;) {
                this.particleStorage.push({
                    x: bombParent.x,
                    y: bombParent.y,
                    pixelPush: [
                        { x: cp.math.random(0, 10) * cp.math.randomPosNeg(), y: cp.math.random(0, 10) * cp.math.randomPosNeg() },
                        { x: cp.math.random(0, 10) * cp.math.randomPosNeg(), y: cp.math.random(0, 10) * cp.math.randomPosNeg() },
                        { x: cp.math.random(0, 10) * cp.math.randomPosNeg(), y: cp.math.random(0, 10) * cp.math.randomPosNeg() }
                    ]
                });
            }
            this.particleCursorLimit = this.particleStorage[0].pixelPush.length;

            // Expiration timer
            this.timerLifespan = new cp.timer(this.expirationTime);
            this.timerStart = Date.now();
        },

        update: function () {
            if (this.timerLifespan.expire()) {
                this.kill();
            } else {
                var growPercent = this.timerLifespan.past() / this.expirationTime;
                this.width = this.widthMax * growPercent;
                this.height = this.heightMax * growPercent;
                this.x = (this.widthMax / 2) + this.xStart - (this.width / 2);
                this.y = (this.heightMax / 2) + this.yStart - (this.height / 2);
            }
        },

        /**
         * @todo Make particles asynchronous
         */
        draw: function () {
            this._super();

            // Ouptut all particles
            cp.ctx.fillStyle = '#fff';

            if (this.particleCursor >= this.particleCursorLimit) {
                this.particleCursor = 0;
            }


            // x *= 0.5
            for (var i = this.particleStorage.length; i--;) {
                cp.ctx.globalAlpha = cp.math.random(1, 10) * 0.1;
                this.particleStorage[i].pixelPush[this.particleCursor].x *= 0.91;
                this.particleStorage[i].pixelPush[this.particleCursor].y *= 0.91;
                this.particleStorage[i].x += this.particleStorage[i].pixelPush[this.particleCursor].x + (3 * cp.math.randomPosNeg());
                this.particleStorage[i].y += this.particleStorage[i].pixelPush[this.particleCursor].y + (3 * cp.math.randomPosNeg());
                cp.ctx.fillRect(this.particleStorage[i].x, this.particleStorage[i].y, 8, 8);
            }
            //cp.ctx.globalAlpha = 1;

            this.particleCursor += 1;
        },

        collide: function () {

        }
    });
}(cp));
