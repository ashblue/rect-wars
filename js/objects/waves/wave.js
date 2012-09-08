cp.template.Wave = cp.template.Entity.extend({
    entities: [],

    init: function(options) {
      options = options || {};
      this.entities = [];
      return options;
    },

    update: function() {
      // get this first entity in this wave
      var e = cp.game.entityGetVal('id',this.entities[0]);

      // if the entity does not exist (killed), check the next one
      while(!e) {
        //get the next entity in this wave
        this.entities.shift();
        e = cp.game.entityGetVal('id',this.entities[0]);
      }

      //if all entities are killed, end wave
      if (!this.entities.length) {
        this.kill();
      }
    },

    kill: function() {
        this._super();

        // Get director and set to spawn next wave
        var director = cp.game.entityGetVal('name','director');
        director[0].wavesSpawn = true;
    }
});