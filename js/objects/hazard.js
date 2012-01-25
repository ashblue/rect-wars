var Hazard = Entity.extend({
    type: 'b',
    width: 20,
    height: 20,
    speedMin: 2,
    speedMax: 6,
    init: function() {
        this.speed = Game.random(this.speedMax, this.speedMin);
        this.alpha = Game.random(9,5) * .1;
        this.partCount = Game.random(12,7);
    },
    update: function() {
        if (this.hp < 1) this.kill();
        
        if (this.y > Game.canvas.height) { this.kill(); }
        else { this.y += this.speed }
    },
    collide: function(object) {
        for(var obj = this.partCount; obj > 0; obj--) {
            Game.spawnEntity(HazardMini, this.x, this.y);
        }
    },
    draw: function() {
            Game.ctx.fillStyle = '#777';
            Game.ctx.globalAlpha = this.alpha;
            Game.ctx.fillRect(this.x,this.y,this.width,this.height);
            Game.ctx.globalAlpha = 1;
    },
    kill: function() {
        this._super();
    }
});
var HazardMini = Entity.extend({
    width: 5,
    height: 5,
    speedMin: 2,
    speedMax: 6,
    init: function() {
        // needs a random 1 or -1
        this.speedX = Game.random(this.speedMax, this.speedMin) * Game.randomPosNeg();
        this.speedY = Game.random(this.speedMax, this.speedMin) * Game.randomPosNeg();
        
        this.alpha = Game.random(7,3) * .1;
    },
    update: function() {            
        if (this.alpha <= .02) {
            this.kill();
        }
        else {
            this.life -= 1;
            this.alpha -= .02;
            this.x += this.speedX;
            this.y += this.speedY;
        }
    },
    draw: function() {
        Game.ctx.fillStyle = '#777';
        Game.ctx.globalAlpha = this.alpha;
        Game.ctx.fillRect(this.x,this.y,this.width,this.height);
        Game.ctx.globalAlpha = 1;
    }
});
var HazardGen = Entity.extend({
    delayMin: 2,
    delayMax: 40,
    delay: 60,
    count: 0,
    update: function() {
            if (this.count > this.delay) {
                    this.count = 0;
                    this.delay = Game.random(this.delayMax,this.delayMin);
                    Game.spawnEntity(Hazard, Game.random(480), -20);
            }
            else {
                    this.count += 1;
            }
    }
});