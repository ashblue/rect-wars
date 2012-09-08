cp.template.DroneZaggerWave = cp.template.Wave.extend({
    /**
     * options = {
     *   drone_count: number of drones to spawn. default = 5
     *   swarm: (boolean) true to allow drones to swarm (not stay in columns). default = false
     * }
     */
    init: function(options) {
      options = options || {};
      options = this._super(options);
      this.entities = [];

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
        this.entities.push(cp.game.spawn('DroneZagger',{min_x:min_x,max_x:max_x}));
      }
    },
});