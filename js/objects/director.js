cp.template.Director = cp.template.Entity.extend({
    name: 'director',
    delay: 2,
    delayInit: 5,
    delayEnd: 5,
    
    wavesCount: 0,
    
    wavesSpawn: true,
    
    init: function() {
      this.waves = [];
      var i = 1;
      for(; i<=100;i++) {
        this.waves.push({entity: 'HazardWave'});
        var dronewave = {entity: 'DroneZaggerWave', options: {drone_count: i}};
        if(i%2 == 0 || i > 8) {
          dronewave.options.swarm = true;
        }
        this.waves.push(dronewave);
      }
    },
    
    update: function() {
        // Check if a wave is active and there is still a player
        if (this.wavesSpawn && this.waves.length && cp.game.entityGetVal('player', true)) {
            var wave = this.waves.shift();
            cp.game.spawn(wave.entity, wave.options);
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