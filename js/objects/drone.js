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


cp.template.DumbDrone = cp.template.Drone.extend({  
    heading: 'right',

    update: function() {
      this._super();
      
      switch(this.heading) {
        case 'right':
          if (this.x < 51) { //if drone has moved right far enough
            this.heading = 'down';
            this.y += this.speed;
          } else {
            this.x -= this.speed;
          }
          break;
        case 'down':
          if ((this.y % 50) < this.speed) { // if drone has moved down far enough
            if (this.x < (cp.core.width / 2)) { //if drone is on right side
              this.heading = 'left';
              this.x += this.speed;
            } else {
              this.heading = 'right';
              this.x -= this.speed;
            }
          } else {
            this.y += this.speed;
          }
          break;
        case 'left':
          if (this.x > (cp.core.width - 50)) { //if dron has moved left far enough
            this.heading = 'down';
            this.y += this.speed;
          } else {
            this.x += this.speed;
          }
      }
    }
});

cp.template.ZigZagDrone = cp.template.Drone.extend({  
    path_points: [],
    
    /**
     * options: {
     *   x: initial x
     *   y: initial y
     *   min_x: farthest point to zig left
     *   max_x: farthest point to zag right
     * }
     */
    init: function(options) {
      options = this._super(options);
      
      var min_x = options.min_x || 50;
      var max_x = options.max_x || cp.core.width - options.min_x;
      
      this.path_points = [];
      
      var next_point = [cp.math.random(min_x, max_x), (-this.height - 5)]; //get the first point

      var i = 1;
      var steps = cp.core.height / 100; // move down 100 px at a time
      for (; i <= steps; i++) {
        var current_point = next_point;
        next_point = [cp.math.random(max_x, min_x),(100*i)];
        
        var rads = cp.math.angle(current_point[0], current_point[1], next_point[0], next_point[1]);

        var path_step = current_point;
        while(path_step[1] < next_point[1]) {
          this.path_points.push(path_step);
          path_step = [
            path_step[0] + this.speed * Math.cos(rads),
            path_step[1] + this.speed * Math.sin(rads)
          ];
        }
      }
    },
    update: function() {
      
      this._super();
      
      if (this.path_points.length === 0) {
        this.kill();
        return;
      }

      var next_step = this.path_points.shift();
      
      this.x = next_step[0];
      this.y = next_step[1];
    }
});

cp.template.ZigZagDroneWave = cp.template.Entity.extend({
    live_drones: [],
    
    /**
     * options = {
     *   drone_count: number of drones to spawn. default = 5
     *   swarm: (boolean) true to allow drones to swarm (not stay in columns). default = false
     * }
     */
    init: function(options) {
      this.live_drones = [];
      
      options = options || {};
      var drone_count = options.drone_count || 5;
      var swarm = options.swarm || false;
      
      if(!swarm) {
        // -40 for padding on left and right
        // divided by number of drones
        var column_width = (cp.core.width - 40) / drone_count;
      }
      
      var i = 0;
      
      for(; i < drone_count; i++) {
        var min_x = 20;
        var max_x = cp.core.width - min_x;
        
        if(!swarm) {
          // starts at x = 20
          // +10*i for padding between drones
          min_x = 30 + (column_width * i);
          
          //add column width to starting x above
          //-10 for padding between
          max_x = min_x + column_width - (10 * (i+1)); 
        }
        this.live_drones.push(cp.game.spawn('ZigZagDrone',{min_x:min_x,max_x:max_x}));
      }
    },
    
    update: function() { 
      // get this first drone in this wave
      var d = cp.game.entityGetVal('id',this.live_drones[0]);
      
      // if the drone does not exist (killed), check the next one
      while(!d) {
        //get the next drone in this wave
        this.live_drones.shift();
        d = cp.game.entityGetVal('id',this.live_drones[0]);
      }
      
      //if all drones are killed, end wave
      if (!this.live_drones.length) {
        this.kill();
      }
    },
    
    kill: function() {
        this._super();
        
        // Get director and set to spawn next wave
        var director = cp.game.entityGetVal('name','director');
        director[0].wavesSpawn = true;
    }
});