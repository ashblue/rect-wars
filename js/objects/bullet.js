cp.template.Bullet = cp.template.Entity.extend({
    name: 'bullet',
    type: 'b',
    width: 3,
    height: 3,
    x: cp.core.width / 2,
    y: cp.core.height - 50,
    active: true,
    speed: 10,
    angle: 1.5707963267948966, // straight south, son!
    delay: -1,
    hp: 1,
    color: '#ff00ff',

    collide: function(object) {
        object.hp -= 1;
        this.kill();
    },
    init: function(origin_x, origin_y, target_x, target_y) {
      this.x = origin_x;
      this.y = origin_y;
      
      this.angle = cp.math.angle(origin_x, origin_y, target_x, target_y);
    },
    update: function() {
      this._super();
      
        this.x = this.x + this.speed * Math.cos(this.angle);
        this.y = this.y + this.speed * Math.sin(this.angle);
        
        //if bullet is outside the screen
        if (this.x < 0 || this.x > cp.core.width || this.y < 0 || this.y > cp.core.height) {
          this.kill();
        }
    },
    draw: function() {
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});