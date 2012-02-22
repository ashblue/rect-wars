var Director = Entity.extend({
    delay: 2,
    delayInit: 5,
    delayEnd: 5,
    
    //waves: {
    //    wave0: HazardWave,
    //    wave1: HazardWave,
    //    wave2: HazardWave,
    //    wave3: HazardWave,
    //    wave4: HazardWave
    //},
    wavesCount: 0,
    wavesSpawn: false,
    
    init: function() {
        // Setup delay timer
        timerDelay = new Timer();
        timerDelay.set(this.delay);
        
        // Setup delay init timer
        timerInitDelay = new Timer();
        timerInitDelay.set(this.delay);
    },
    update: function() {
        // Check if a wave is active
        if (this.wavesSpawn) {
            //Game.spawnEntity(this.waves[this.wavesCount], 0, 0);
            this.wavesCount = false;
        }
                // If not spawn next wave
                // If spawned wave does not exist, kill director and all elements, boot up next game phase
    },
    kill: function() {
        this._super();
        
        // Grab all existing elements and run kill on them
    }
});
//var Lv1 = Director.extend({
//    waves: {
//        wave1: HazardWave,
//        wave2: HazardWave,
//        wave3: HazardWave,
//        wave4: HazardWave,
//        wave5: HazardWave,
//        wave6: Boss
//    }
//});