cp.template.Drone = cp.template.Entity.extend({
    type: 'b',
    width: 30,
    height: 30,
    x: cp.core.width + 5,
    y: 50,
    active: true,
    speed: 3,
    delay: -1,
    hp: 2,
    color: '#CCCCCC',
    heading: 'right',
    path_points: [],
    style: 'easy',
    
    init: function(style) {
      if(style) {
        this.style = style;
      }
      switch(this.style) {
        case 'hard': 
          var min_x = 50;
          var max_x = cp.core.width - min_x;

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
          break;
        //end hard
      }
    },

    collide: function(object) {
        object.hp -= 1;
        this.kill();
    },

    update: function() {
      switch(this.style) {
        case 'hard': 
          if (this.path_points.length === 0) {
            this.kill();
            return;
          }

          var next_step = this.path_points.shift();

          this.x = next_step[0];
          this.y = next_step[1];

          if (cp.math.random(50,1) == 5) {
            cp.game.spawn('Bullet',this.x, this.y, 350, 350);
          }
          break;
        //end hard
        
        default:
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
        //end default
      }
    },
    
    draw: function() {
        // Change to a triangle later
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});

cp.template.Drone2 = cp.template.Drone.extend({
    path_points: [],
    
    init: function() {
      var min_x = 50;
      var max_x = cp.core.width - min_x;
      
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
      if (this.path_points.length === 0) {
        this.kill();
        return;
      }
      
      var next_step = this.path_points.shift();
      
      this.x = next_step[0];
      this.y = next_step[1];
      
      if (cp.math.random(50,1) == 5) {
        cp.game.spawn('Bullet',this.x, this.y, 350, 350);
      }
    }
});

cp.template.Drone3 = cp.template.Drone.extend({
});