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
    color: '#eee',
    
    collide: function(object) {
        //this.kill();
        object.kill();
    },
    init: function() {
            // Put keyboard info on core
            window.addEventListener('keydown', this.keyboardDown, true);
            window.addEventListener('keyup', this.keyboardUp, true);
    },
    // On upgrade remove keyboard info and refactor. Currently its built into the core.
    keyboardDown: function(event) {
            switch(event.keyCode) {
                    case 37: // Left
                            Game.left = true;
                            break;
                    case 39: // Right
                            Game.right = true;
                            break;
                    case 32: // Spacebar
                            Game.space = true;
                            break;
                    default:
                            break;
            }
    },
    keyboardUp: function(event) {
            switch(event.keyCode) {
                    case 37: // Left
                            Game.left = false;
                            break;
                    case 39: // Right
                            Game.right = false;
                            break;
                    case 32: // Spacebar
                            Game.space = false;
                            break;
                    default:
                            break;
            }
    },
    update: function() {
            // Movement
            if (Game.left && this.x > 0)
                    this.x -= this.speed;
            else if (Game.right && this.x < Game.width - this.width)
                    this.x += this.speed;
                    
            // Shoot
            if (Game.space && this.delay < 0) {
                    Game.spawnEntity(Laser, this.x + (this.width / 2), this.y);
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
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});