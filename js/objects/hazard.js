cp.template.Hazard = cp.template.Entity.extend({
    type: 'b',
    width: 20,
    height: 20,
    speedMin: 2,
    speedMax: 6,
    y: -20,
    
    init: function(x) {
        this.x = x;
        this.speed = cp.math.random(this.speedMax, this.speedMin);
        this.alpha = cp.math.random(9, 5) * .1;
        this.partCount = cp.math.random(12, 7);
    },
    
    update: function() {
        if (this.hp < 1) this.kill();
        
        if (this.y > cp.core.height) {
            this.kill();
        } else {
            this.y += this.speed
        }
    },
    
    collide: function(object) {
        object.hp -= 1;
        for(var obj = this.partCount; obj > 0; obj--) {
            cp.game.spawn('HazardMini', this.x, this.y);
        }
    },
    
    draw: function() {
            cp.ctx.fillStyle = '#777';
            cp.ctx.globalAlpha = this.alpha;
            cp.ctx.fillRect(this.x, this.y, this.width, this.height);
            cp.ctx.globalAlpha = 1;
    }
});

cp.template.HazardMini = cp.template.Entity.extend({
    width: 5,
    height: 5,
    speedMin: 2,
    speedMax: 6,
    
    init: function(x, y) {
        this.x = x;
        this.y = y;
        
        // needs a random 1 or -1
        this.speedX = cp.math.random(this.speedMax, this.speedMin) * cp.math.randomPosNeg();
        this.speedY = cp.math.random(this.speedMax, this.speedMin) * cp.math.randomPosNeg();
        
        this.alpha = cp.math.random(7,3) * .1;
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
        cp.ctx.fillStyle = '#777';
        cp.ctx.globalAlpha = this.alpha;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
        cp.ctx.globalAlpha = 1;
    }
});

cp.template.HazardWave = cp.template.Entity.extend({
    delay: 60,
    delayMin: 2,
    delayMax: 40,
    
    count: 0,
    countTotal: 0,
    countMax: 10,
    
    update: function() {
        if (this.count > this.delay) {
            this.count = 0;
            this.delay = cp.math.random(this.delayMax,this.delayMin);
            cp.game.spawn('Hazard', cp.math.random(480));
            this.countTotal++;
        } else if (this.countTotal >= this.countMax) {
            this.kill();
        } else {
            this.count += 1;
        }
    },
    
    kill: function() {
        // Get director and set wavesCount to true
        var director = cp.game.entityGetVal('name','director');
        director[0].wavesSpawn = true;
        
        this._super();
    }
});