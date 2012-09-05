cp.template.DroneDyo = cp.template.Drone.extend({
    next_stop_y: 100,
    in_position: false,
    fire_delay: 20,
    fire_delay_count: 30,
    clip_size: 3,
    clip_count: 3,

    /**
     * options: {
     *   x: initial x
     *   y: initial y
     *   min_x: farthest point to zig left
     *   max_x: farthest point to zag right
     * }
     */
    init: function(options) {
        this.animImage = 'drone-2.png';
        this.animFrameWidth = 55;
        this.animFrameHeight = 55;

        //start at random x position
        this.x = cp.math.random(cp.core.width, 0);
        this.y = -this.animFrameHeight;

        options = this._super(options);
    },

    update: function() {
        this._super();

        if (this.in_position) {
            if (this.fire_delay_count) {
                this.fire_delay_count--;
            } else {
                if (this.clip_count) {
                    this.clip_count--;
                    this.fireAtPlayer();
                } else {
                    this.clip_count = this.clip_size;
                    this.in_position = false;
                }
                this.fire_delay_count = this.fire_delay;
            }
        } else {
            if(this.y < this.next_stop_y) {
                this.y += this.speed;
            } else {
                this.in_position = true;
                this.next_stop_y += 100;
            }
        }
    },

    fireAtPlayer: function() {
        var players = cp.game.entityGetVal('player',true);

        //if there are players to shoot at
        if(players) {
            //shoot at a random player target
            var target = players[cp.math.random(players.length) - 1];

            var half_sight_range = (cp.core.width * this.accuracy) / 2;
            var sight_left = 0 + half_sight_range;
            var sight_right = cp.core.width - half_sight_range;

            this.animDefault.reset();
            cp.game.spawn('Bullet', this.x, this.y, cp.math.random(sight_right, sight_left), target.y);
        }
    }
});