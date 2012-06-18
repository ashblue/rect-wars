/**
 * Powerup
 */
cp.template.Powerup = cp.template.Entity.extend({
    type: 'b',
    width: 35,
    height: 55,
    speed: 1,
    y: 0,

    collide: function(object) {
        if (object.player === true) {
            this.kill();
            this.upgrade(object);
        }
    },
    
    update: function() {
        this._super();
        
        if (this.y > cp.ctx.canvas.height) {
            this.kill();
        } else {
            this.y += this.speed;
        }
    }
});

cp.template.PowerupShield = cp.template.Powerup.extend({

	init: function() {
        this.pauseFlash = new cp.timer();
        this.pauseFlash.set(2);
        
        this.x = 50; //random (canvas width))
        
        this.animSheet = new cp.animate.sheet('shield-sprite.png', this.width, this.height);
        this.animFlash = new cp.animate.cycle(this.animSheet, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
        this.animSet = this.animFlash;
	},
	
	update: function() {
		this._super();
		if(this.pauseFlash.expire()) {
            this.animFlash.reset();
            this.pauseFlash.reset();
        }
	},
	
    upgrade: function(obj) {
        obj.color = '#00ff00';
    }
});

cp.template.PowerupLaBomba = cp.template.Powerup.extend({
	
	init: function() {
		this.x = 100;
		this.animSheet = new cp.animate.sheet('labomba-sprite.png', this.width, this.height);
		this.animSpin = new cp.animate.cycle(this.animSheet, 0.1, [0, 1, 2, 3]);
		this.animSpin.repeat = true;
		this.animSet = this.animSpin;
	},
	
	upgrade: function(obj) {
		obj.color = '#00f';
	}
});
