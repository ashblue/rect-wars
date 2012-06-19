cp.template.Bullet = cp.template.Entity.extend({
    name: 'bullet',
    type: 'a',
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
        this.x = this.x + this.speed * Math.cos(this.angle);
        this.y = this.y + this.speed * Math.sin(this.angle);
    },
    draw: function() {
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});