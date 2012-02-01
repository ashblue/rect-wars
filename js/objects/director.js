var Director = Entity.extend({
    delay: 2000,
    delayInit: 5000,
    delayEnd: 5000,
    
    waves: {
        wave1: HazardWave,
        wave2: HazardWave,
        wave3: HazardWave,
        wave4: HazardWave,
        wave5: HazardWave,
        wave6: Boss
    },
    wavesCount: 1,
    
    init: function() {
        // Setup delay timer
        
        // Setup delay init timer
    },
    update: function() {
        // Check if a wave is active
            // Search for existing wave entity and see if it exists
                // If not spawn next wave
                // If spawned wave does not exist, kill director and all elements, boot up next game phase
    },
    kill: function() {
        this._super();
        
        // Grab all existing elements and run kill on them
    }
});
var Lv1 = Director.extend({
    waves: {
        wave1: HazardWave,
        wave2: HazardWave,
        wave3: HazardWave,
        wave4: HazardWave,
        wave5: HazardWave,
        wave6: Boss
    }
});