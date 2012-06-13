var Powerup = Entity.extend({
    type: 'b',
    width: 35,
    height: 65,
    speed: 2,
    x: 50,
    y: 50,
        

    collide: function(object) {
        if (object.player === true) {
            this.kill();
            // set player powerup
            // object.power = ?
            this.upgrade(object);
        }
    },
    
    init: function() {
        
        this.pauseFlash = new Timer();
        this.pauseFlash.set(2);
        
        this.x = 50; //random (canvas width))
        
        this.animSheet = new AnimSheet('shield-sprite.png', 35, 55);
        this.animFlash = new Anim(this.animSheet, 50, [0, 1, 2, 3, 4, 5, 6, 7], {
            repeat: false
        });
        this.animSet = this.animFlash;
    },
    
    update: function() {
        
        this._super();
        
        if (this.y > Game.canvas.height) {
            this.kill();
        } else {
            this.y += this.speed;
        }

        if(this.pauseFlash.expire()) {
            this.animFlash.reset();
            this.pauseFlash.reset();
        }
    },
    
    upgrade: function(obj) {
        console.log(obj);
    }
});

var PowerupShield = Powerup.extend({
    animSheet: '',
    offsetX: '',
    offsetY: '',
    upgrade: function(obj) {
        console.log(obj);
        obj.color = '#00ff00';
    }
});
