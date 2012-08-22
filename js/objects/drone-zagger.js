cp.template.DroneZagger = cp.template.Drone.extend({  
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
      
      //shoot randomly
      if (cp.math.random(50) == 5) {
          this.fireAtPlayer();
      }
    }
});

cp.template.DroneZaggerWave = cp.template.Entity.extend({
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
        this.live_drones.push(cp.game.spawn('DroneZagger',{min_x:min_x,max_x:max_x}));
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