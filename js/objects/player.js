var Player = Entity.extend({
    type: 'a',
    width: 100,
    height: 200,
    x: Game.width / 2,
    y: Game.height - 250,
    active: true,
    speed: 3,
    delay: -1,
    hp: 10,
    color: '#ff0000',
    player: true,

    collide: function(object) {
        //this.kill();
        object.kill();
    },
    init: function() {
        // Create and set an animation sheet (image, frame width, frame height)
        var animSheet = new AnimSheet('dude.png', 100, 200);

        // Choose a particular animation sequence from the sheet
        // Anim(sheet, speed in seconds, frame order, repeat)
        this.animLeft = new Anim(animSheet, 1, [2]);
        this.animRight = new Anim(animSheet, 1, [1]);
        this.animCenter = new Anim(animSheet, 1, [0,1], {
            repeat: true,
            alpha: 1,
            offsetX: 0,
            offsetY: 0,
            flipX: false,
            flipY: false
        });
        this.animUp = new Anim(animSheet, 1, [3,4], {
            repeat: true,
            alpha: 1,
            offsetX: 0,
            offsetY: 0,
            flipX: false,
            flipY: false
        });
        this.animDown = new Anim(animSheet, 1, [4]);

        this.animSet = this.animCenter;
    },
    update: function() {
        this._super();
        // Movement
        if (Key.press('arrowLeft') && this.x > 0) {
            this.animSet = this.animLeft;
            this.x -= this.speed;
        }
        if (Key.press('arrowRight') && this.x < Game.width - this.width) {
            this.animSet = this.animRight;
            this.x += this.speed;
        }
        if (Key.press('arrowUp') && this.y > 0) {
            this.animSet = this.animUp;
            this.y -= this.speed;
        }
        if (Key.press('arrowDown') && this.y < Game.height - this.height) {
            this.animSet = this.animDown;
            this.y += this.speed;
        }

        // Shoot
        if (Key.press('space') && this.delay < 0) {
            Game.spawnEntity(Laser, this.x + (this.width / 2), this.y);
            this.delay = 20;
        }
        else {
            if (Input.key.down.length < 1) {
                this.animSet = this.animCenter;
            }
            this.delay -= 1;
        }
    },
    draw: function() {
        this._super();
        // Change to a triangle later
        // Game.ctx.fillStyle = this.color;
        // Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});
var Laser = Entity.extend({
    type: 'a',
    width: 2,
    height: 14,
    speed: 5,
    color: '#eee',
    collide: function(object) {
        object.hp -= 1;
        this.kill();
    },
    update: function() {
        this.y -= 5;
    },
    draw: function() {
        // Change to a triangle later
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
    }
});
