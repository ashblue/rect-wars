var Bullet = Entity.extend({
    name: "bullet",
    type: 'a',
    width: 3,
    height: 3,
    x: Game.width / 2,
    y: Game.height - 50,
    active: true,
    speed: 10,
    angle: -1.75,
    delay: -1,
    hp: 1,
    color: '#ff00ff',

    collide: function(object) {
        object.hp -= 1;
        this.kill();
    },
    init: function() {
		/* *
        console.log("init bullet");
    
        console.log("mouse_x");
        console.log(mouse_x);
        console.log("mouse_y");
        console.log(mouse_y);
    
        console.log("this.x");
        console.log(this.x);
        console.log("this.y");
        console.log(this.y);
		/* */
        
    },
    update: function() {
        this.x = this.x + this.speed * Math.cos(this.angle);
        this.y = this.y + this.speed * Math.sin(this.angle);
    },
    draw: function() {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});

/* *
var mouse_x;
var mouse_y;
Game.canvas.addEventListener('click', on_canvas_click, false);
function on_canvas_click(ev) {
    mouse_x = ev.clientX - Game.canvas.offsetLeft;
    mouse_y = ev.clientY - Game.canvas.offsetTop; 
    
    Game.spawnEntity(Bullet, this.x + (this.width / 2), this.y, "face");
}

/* */