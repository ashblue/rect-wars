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