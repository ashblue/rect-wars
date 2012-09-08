/**
 * This wave is to allow a down period for any length of time.
 *
 */
cp.template.EmptyWave = cp.template.Wave.extend({
    delay_count: 300, // default to 5 second delay

    /**
     * options = {
     *   seconds: number of seconds
     * }
     */
    init: function(options) {
      options = options || {};
      options = this._super(options);
      this.entities = [];

      if(options.seconds) {
        // the delay counts frames, so convert seconds to frames
        this.delay_count = options.seconds * 60;
      }
    },

    update: function() {
        //dont call _super here, because it will check this.entities, which is empty
        if(this.delay_count) {
            this.delay_count--;
        } else {
            //ends the wave
            this.kill();
        }
    },
});