cp.template.DroneCarrier = cp.template.Drone.extend({
    unload_y: cp.core.height * 0.25,
    mini_delay: 30,
    mini_delay_count: this.mini_delay,
    minis: 10,
    
    /**
     * options: {
     *   x: initial x
     *   y: initial y
     *   min_x: farthest point to zig left
     *   max_x: farthest point to zag right
     * }
     */
    init: function(options) {
        this.animImage = 'drone-3.png';
        this.animFrameWidth = 200;
        this.animFrameHeight = 147;
        this.animFrames = [0];
        
        this.speed = 1;
        
        this.x = cp.math.random(cp.core.width, 0);
        
        this.y = -this.animFrameWidth;
        
        this.unload_y = cp.math.random(cp.core.height * 0.25, 50);

        options = this._super(options);
    },
    
    update: function() {
      this._super();
      
      if(this.y < this.unload_y) {
        this.y += this.speed;
      } else if(this.minis) {
          if(this.mini_delay_count) {
              this.mini_delay_count -= 1;
          } else {
            this.unloadDroneMini()
          }
      }
    },
    
    unloadDroneMini: function() {
        console.log('unload mini');
        cp.game.spawn('DroneMini', {x: this.x, y: this.y, carrier: this})
        
        this.minis -= 1;
        this.mini_delay_count = this.mini_delay;
    }
});