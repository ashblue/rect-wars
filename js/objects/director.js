cp.template.Director = cp.template.Entity.extend({
    name: 'director',
    delay: 2,
    delayInit: 5,
    delayEnd: 5,
    
    wavesCount: 0,
    
    wavesSpawn: true,
    
    init: function() {
        // Setup your array for how many waves you want
        this.waves = [
            'HazardWave',
            'ZigZagDroneWave',
            'HazardWave',
            'ZigZagDroneWave',
            'HazardWave',
            'ZigZagDroneWave',
            'HazardWave',
            'ZigZagDroneWave',
            'HazardWave',
        ];
    },
    
    update: function() {
        // Check if a wave is active
        if (this.wavesSpawn && this.waves.length) {
            var wave = this.waves.pop();
            cp.game.spawn(wave);
            this.wavesSpawn = false;
        }
    },
    
    kill: function() {
        this._super();
        
        // Grab all existing elements and run kill on them
    }
});

//cp.template.lv1 = cp.template.Director.extend({
//    waves: {
//        wave1: HazardWave,
//        wave2: HazardWave,
//        wave3: HazardWave,
//        wave4: HazardWave,
//        wave5: HazardWave,
//        wave6: Boss
//    }
//});