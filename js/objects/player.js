cp.template.Player = cp.template.Entity.extend({
    type: 'a',
    width: 25,
    height: 35,
    x: cp.core.width / 2,
    y: cp.core.height - 250,
    speed: 3,
    color: '#f00',
    player: true, // Do not remove, used for search functionality elsewhere
    bulletSpeed: .3, // Time in seconds between bullets fired
    hp: 10,

    offset: {
        x:-25,
        y:-15
    },

    init: function() {
        this.delay = new cp.timer(this.bulletSpeed);
        this.centerShipTimer = new cp.timer();

        // Create and set an animation sheet (image, frame width, frame height)
        this.animSheet = new cp.animate.sheet('player.png', 75, 55);

        // Choose a particular animation sequence from the sheet
        // Anim(sheet, speed in seconds, frame order, repeat)
        // this.animUp = new cp.animate.cycle(this.animSheet, 1, [3,4], true);
        this.animRight = new cp.animate.cycle(this.animSheet, 1, [2]);
        // this.animDown = new cp.animate.cycle(this.animSheet, 1, [4]);
        this.animLeft = new cp.animate.cycle(this.animSheet, 1, [1]);
        this.animCenter = new cp.animate.cycle(this.animSheet, 1, [0]);

        this.animSet = this.animCenter;
    },

    update: function() {
        if(this.hp <= 0) {
          this.kill();
        }
        this._super();

        // Movement
        if (cp.input.press('left') && this.x > 0) {
            this.centerShipTimer.set(.2);
            this.centerShipTimer.reset();
            this.animSet = this.animLeft;
            this.x -= this.speed;
        }
        if (cp.input.press('right') && this.x < cp.core.width - this.width) {
            this.centerShipTimer.set(.2);
            this.centerShipTimer.reset();
            this.animSet = this.animRight;
            this.x += this.speed;
        }
        if (cp.input.press('up') && this.y > 0) {
            this.animSet = this.animCenter;
            //this.animSet = this.animUp;
            this.y -= this.speed;
        }
        if (cp.input.press('down') && this.y < cp.core.height - this.height) {
            this.animSet = this.animCenter;
            //this.animSet = this.animDown;
            this.y += this.speed;
        }

        // Shoot
        if (cp.input.press('shoot') && this.delay.expire()) {
            cp.game.spawn('Laser', this.x + (this.width / 2), this.y);
            this.delay.reset();
        }

        if (this.centerShipTimer.expire()) {
            this.centerShipTimer.reset();
            this.animSet = this.animCenter;
        }
    },

    draw: function() {
        this._super();

        // Placeholder image
        // cp.ctx.fillStyle = this.color;
        // cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    collide: function(object) {
        // this._super();
        object.kill();
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
        this.kill();
    }
});
