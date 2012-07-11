cp.template.Background = cp.template.Entity.extend({
    color: '#111',
    stars: [],
    starSpeed: 0.6, // Delay between generating new stars
    starSpeedMax: 10, // Configure max range for random star generation delay
    starSpeedMin: 1, // Configure min range for random star generation delay
    starTimer: null, // Create a new star at expiration

    init: function() {
        this.timer = new cp.timer(this.starSpeed);
    },

    update: function() {
        this.starGen();
    },

    // Star generator
    starGen: function() {
        if (this.timer.expire()) {
            var star = new cp.template.Star();
            star.init();
            this.stars.push(star);
            this.timer.set(cp.math.random(this.starSpeedMax, this.starSpeedMin) * 0.1);
            this.timer.reset();
        }
    },

    draw: function() {
        cp.ctx.fillStyle = this.color;
        cp.ctx.fillRect(this.x, this.y, cp.core.width, cp.core.height);
        
        // For each star
        for (var i = this.stars.length; i--;) {
            // Run draw
            this.stars[i].draw();
            
            this.stars[i].y += this.stars[i].speed;
            
            if (this.stars[i].y > cp.core.height)
                this.stars.splice(i, 1); 
        }
        
        // Reset global alpha to prevent screwing up other images
        cp.ctx.globalAlpha = 1;
        
        console.log(this.stars.length);
    }
});

cp.template.Star = cp.template.Entity.extend({
    color: '#fff',

    init: function() {
        this.width = cp.math.random(2, 1);
        this.height = cp.math.random(2, 1);
        this.x = cp.math.random(cp.core.width);
        this.alpha = cp.math.random(8, 3) * 0.1;
        this.speed = cp.math.random(6, 4) * 0.1;
    },

    draw: function() {
        cp.ctx.fillStyle = this.color;
        cp.ctx.globalAlpha = this.alpha;
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});