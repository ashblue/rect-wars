cp.template.AsteroidWave = cp.template.Wave.extend({
    /**
     * options = {
     *   drone_count: number of drones to spawn. default = 5
     * }
     */
    init: function(options) {
      options = options || {};
      options = this._super(options);
      this.entities = [];

      var drone_count = options.drone_count || 1;

      for(var i = drone_count; i--;) {
        this.entities.push(cp.game.spawn('Asteroid'));
      }
    },

    kill: function() {
        //just send antoher one
        this.entities.push(cp.game.spawn('Asteroid'));

        //the wave never ends!!!
    }
});