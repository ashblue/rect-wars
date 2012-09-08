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
        },

        update: function () {
            this._super();

            this.y -= this.speed;

            if (this.y < this.boundaryTop) {
                console.log('bomb dead');
                this.kill();
            }
        },

        collide: function () {
            console.log('bomb dead');
            cp.game.spawn('BombExplosion', this);
            this.kill();
        }
    });

    cp.template.BombExplosion = cp.template.Entity.extend({
        type: 'a',
        width: 300,
        height: 300,

        init: function (bombParent) {
            this.x = bombParent.xMiddle + bombParent.x - this.width;
            this.y = bombParent.y - this.height;
        },

        update: function () {
            this._super();

            this.y -= this.speed;

            if (this.y < this.boundaryTop) {
                console.log('bomb dead');
                this.kill();
            }
        },

        collide: function () {
            this.kill();
        }
    });
}(cp));
