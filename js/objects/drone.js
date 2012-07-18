cp.template.Drone = cp.template.Entity.extend({
    type: 'b',
    width: 30,
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
      
      return options;
    },

    collide: function(object) {
        object.hp -= 1;
        this.kill();
    },

    update: function() {
      //shoot randomly
      if (cp.math.random(50) == 5) {
        var players = cp.game.entityGetVal('player',true);
        
        //if there are players to shoot at
        if(players) {
          var player = players[cp.math.random(players.length) - 1];
          
          var half_sight_range = (cp.core.width * this.accuracy) / 2;
          var sight_left = 0 + half_sight_range;
          var sight_right = cp.core.width - half_sight_range;
          
          cp.game.spawn('Bullet',this.x, this.y, cp.math.random(sight_right,sight_left), player.y);
        }
      }
    },
    
    draw: function() {
        // Change to a triangle later
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});