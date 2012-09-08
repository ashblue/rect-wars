(function() {

    var _states = {
        firing: function(self) {
            if (self.fire_delay_count) {
                self.fire_delay_count--;
            } else {
                if (self.clip_count) {
                    self.clip_count--;
                    self.fireAtPlayer();
                } else { //clip is empty
                    // switch to advancing state
                    _private.changeState(self, 'advancing');
                }
            }
        },
        advancing: function(self) {
            //if not in position
            if(self.y < self.next_stop_y) {
                //continue to move into position
                self.y += self.speed;
            } else { //if in position
                // switch to firing state
                _private.changeState(self, 'firing');
            }
        }
    };

    var _private = {
        changeState: function(self, newState) {
            // switch updates
            switch(newState){
                case 'firing':
                    //reset clip
                    self.clip_count = self.clip_size;
                    break;

                case 'advancing':
                    // update target position for next advance
                    self.next_stop_y += 100;
                    break;
            }

            // switch state
            self.stateUpdate = _states[newState];
        }
    };

    cp.template.DroneTurret = cp.template.Drone.extend({
        next_stop_y: 100,
        fire_delay: 20,
        fire_delay_count: 30,
        clip_size: 3,
        clip_count: 3,
        stateUpdate: _states.advancing,

        /**
         * options: {
         * }
         */
        init: function(options) {
            console.log("initializing turret");
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
            this.stateUpdate(this);
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

                //reset fire delay
                this.fire_delay_count = this.fire_delay;
            }
        }


    });
}());