var Background = Entity.extend({
    timerDef: 60,
    init: function() {
        this.timer = this.timerDef;
    },
    update: function() {
        if (this.timer < 1) {
            Game.spawnEntity(Star, 0, 0);
            this.timer = Game.random(this.timerDef);
        }
        else {
            this.timer -= 1;
        }
    },
    draw: function() {
        Game.ctx.fillStyle = '#111';
        Game.ctx.fillRect(this.x,this.y,Game.canvas.width,Game.canvas.height);
    }
});
var Star = Entity.extend({
    speed: .5,
    init: function() {
        this.width = Game.random(3, 1);
        this.height = Game.random(3, 1);
        this.x = Game.random(Game.canvas.width);
        this.alpha = Game.random(7,3) * .1;
    },
    update: function() {
        this.y += .5;
    },
    draw: function() {
        Game.ctx.fillStyle = '#eee';
        Game.ctx.globalAlpha = this.alpha;
        Game.ctx.fillRect(this.x,this.y,this.width,this.height);
        Game.ctx.globalAlpha = 1;
    }
});