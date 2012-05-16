var Player = Entity.extend({
    type: 'a',
    width: 30,
    height: 30,
    x: Game.width / 2,
    y: Game.height - 50,
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
    },
    update: function() {
        // Movement
        if (Key.press('arrowLeft') && this.x > 0)
            this.x -= this.speed;
        if (Key.press('arrowRight') && this.x < Game.width - this.width)
            this.x += this.speed;
        if (Key.press('arrowUp') && this.y > 0)
            this.y -= this.speed;
        if (Key.press('arrowDown') && this.y < Game.height - this.height)
            this.y += this.speed;

        // Shoot
        if (Key.press('space') && this.delay < 0) {
            Game.spawnEntity(Laser, this.x + (this.width / 2), this.y);
            this.delay = 20;
        }
        else if (Key.press('b') && this.delay < 0) {
            Game.spawnEntity(Bullet, this.x + (this.width / 2), this.y);
            this.delay = 20;
        }
        else {
            this.delay -= 1;
        }
    },
    draw: function() {
        // Change to a triangle later
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
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
