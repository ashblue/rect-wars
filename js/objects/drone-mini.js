cp.template.DroneMini = cp.template.Drone.extend({
    target_player: null,
    attacking: true,
    carrier: null,
    range: 100,
    
    /**
     * options: {
     *   carrier: the drone-carrier that launched this drone-mini
     * }
     */
    init: function(options) {      
        this.animImage = 'drone-4.png';
        this.animFrameWidth = 49;
        this.animFrameHeight = 28;
        this.animFrames = [0,1,2];
        
        this.speed = 4;
        
        options = this._super(options);
        
        this.carrier = options.carrier || this.carrier;
      
        var players = cp.game.entityGetVal('player',true);
        
        //if there are players
        if(players) {
            //pick a target
            this.target_player = players[cp.math.random(players.length,0) - 1];
        }
    },
    
    update: function() {
      this._super();
      
      if(this.attacking) {
        if(this.x > this.target_player.x + this.range) {
            this.x -= this.speed;
        } else if (this.x < this.target_player.x - this.range) {
            this.x += this.speed;
        } else if (this.y < this.target_player.y - this.range) {
            this.y += this.speed;
        } else if (this.y > this.target_player.y + this.range) {
            this.y -= this.speed;
        } else {
            this.attacking = !this.attacking;
        }
      } else {
        if(this.x > this.carrier.x) {
            this.x -= this.speed;
        } else if (this.x < this.carrier.x) {
            this.x += this.speed;
        } else if (this.y < this.carrier.y) {
            this.y += this.speed;
        } else if (this.y > this.carrier.y) {
            this.y -= this.speed;
        } else {
            this.attacking = !this.attacking;
        }
      }
    },
});