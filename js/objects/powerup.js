var Powerup = Entity.extend({
    type: 'b',
    width: 10,
    height: 10,
    speed: 3,

    collide: function(object) {
        if (object.player === true) {
            this.kill();
            // set player powerup
            // object.power = ?
        }
    },
    init: function() {
    },
    update: function() {
        if (this.y > Game.canvas.height) { this.kill(); }
        else { this.y += this.speed }
    },
    draw: function() {
        // Change to a triangle later
        Game.ctx.fillStyle = '#ff0000';
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});
