cp.template.Drone = cp.template.Entity.extend({
    type: 'b',
    width: 65,
    height: 30,
    x: cp.core.width / 2,
    y: 50,
    active: true,
    speed: 3,
    delay: -1,
    hp: 2,
    color: '#CCCCCC',
    accuracy: 0.5, // 0 to 1
    
    init: function(options) {
      options = options || {};
      this.x = options.x || this.x;
      this.y = options.y || this.y;
      
      // Create and set an animation sheet (image, frame width, frame height)
      var animSheet = new cp.animate.sheet('drone-1.png', 65, 50);
	  //var animSheet = new cp.animate.sheet('drone-2.png', 55, 55);
	  //var animSheet = new cp.animate.sheet('drone-3.png', 75, 55);
	  //var animSheet = new cp.animate.sheet('drone-4.png', 95, 55);
      
      this.animDefault = new cp.animate.cycle(animSheet, 0.1, [0,1,2], false);
      
      this.animSet = this.animDefault;
      
      return options;
    },

    collide: function(object) {
        object.hp -= 1;
        this.kill();
    },

    update: function() {
      this._super();
      //shoot randomly
      if (cp.math.random(50) == 5) {
        var players = cp.game.entityGetVal('player',true);
        
        //if there are players to shoot at
        if(players) {
		
		  //get available targets
		  var targets = [];
		  for(i in players) {
		    var player = players[i];
		    //if player is in front of drone
		    if(player.y > this.y+50) {
				targets.push(player);
			}
		  }
		  
		  if(targets.length > 0) {
		    //shoot at a random player target
		    var target = targets[cp.math.random(targets.length) - 1];
		    
		    var half_sight_range = (cp.core.width * this.accuracy) / 2;
		    var sight_left = 0 + half_sight_range;
		    var sight_right = cp.core.width - half_sight_range;
		  
		    this.animDefault.reset();
		    //cp.game.spawn('Bullet', this.x, this.y, cp.math.random(sight_right,sight_left), target.y);			
		    cp.game.spawn('Bullet', this.x, this.y, this.x, cp.core.width + 10);			
		    cp.game.spawn('Bullet', this.x+60, this.y, this.x, cp.core.width + 10);
		  }
        }
      }
    },
    
    draw: function() {
        this._super();
        
        // Change to a triangle later
        //cp.ctx.fillStyle = this.color;
        //cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});