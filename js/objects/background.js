cp.template.Background = cp.template.Entity.extend({
    color: '#111',
    starSpeed: .6, // Delay between generating new stars
    starSpeedMax: 10, // Configure max range for random star generation delay .0 prepended
    starSpeedMin: 1, // Configure min range for random star generation delay . 0 prepended

    init: function() {
        this.timer = new cp.timer(this.starSpeed);
    },

    update: function() {
        this.starGen();
    },

    // Star generator
    starGen: function() {
        if (this.timer.expire()) {
            cp.game.spawn('Star');
            this.timer.set(cp.math.random(this.starSpeedMax, this.starSpeedMin) * .1);
            this.timer.reset();
        }
    },

    draw: function() {
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x, this.y, cp.core.width, cp.core.height);
    },
});

cp.template.Star = cp.template.Entity.extend({
    color: '#fff',

    init: function() {
        this.width = cp.math.random(2, 1);
        this.height = cp.math.random(2, 1);
        this.x = cp.math.random(cp.core.width);
        this.alpha = cp.math.random(8, 3) * .1;
        this.speed = cp.math.random(6, 4) * .1;
    },

    update: function() {
        this.y += this.speed;

        // Kill if it goes out of bounds
        if (this.y > cp.core.height)
            this.kill();
    },

    draw: function() {
        cp.ctx.fillStyle = this.color;
        cp.ctx.globalAlpha = this.alpha;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);

        // Reset global alpha to prevent screwing up other images
        cp.ctx.globalAlpha = 1;
    }
});