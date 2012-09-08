/**
 * @fileoverview The object that will house all stats functionality.
 * @author gkoehl@nerdery.com (Gary Koehl)
 */

(function(cp) {
    /**
     * @type {string} Holds the stats table name.
     */
    var STATS_TABLE_NAME = 'stats';

    /**
     * @type {string} Holds the achievements table name.
     */
    var ACHIEVEMENTS_TABLE_NAME = 'achievements';

    /**
     * The stats object.
     */
    cp.stats = {
        /**
         * @type {array} Holds a copy of the database table rows.
         */
        _data: null,

        /**
         * The stats object
         */
        init: function() {
            this.resetData();
        },

        /**
         * Resets the _data property the current state of the database.
         */
        resetData: function() {
            var statsTable = myDB.getTable(STATS_TABLE_NAME);
            this._data = statsTable;
        },

        /**
         * Updates the database with the current _data property.
         */
        saveData: function() {
            var index = 0;
            var dataLength = this._data.length;
            for (; index < dataLength; index++) {
                myDB.quickReplace(
                    STATS_TABLE_NAME,
                    index,
                    'data',
                    this._data[index].data
                );
            }

            // Unlock any achievements
            this.unlockAchievements();
        },

        /**
         * Unlock achievements based on the current state of the database.
         */
        unlockAchievements: function() {
            var statsTable = myDB.getTable(STATS_TABLE_NAME);
            var achievementsTable = myDB.getTable(ACHIEVEMENTS_TABLE_NAME);

            // Check for button masher achievement, id - 0
            // Checks bullets fired stat, id - 3
            if (!achievementsTable[0].unlocked &&
                statsTable[3].data >= 1000) {
                myDB.quickReplace(
                    ACHIEVEMENTS_TABLE_NAME,
                    0,
                    'unlocked',
                    true
                );
            }

            // Check for cyberspace surfer achievement, id - 1
            // Checks levels completed stat, id - 5
            if (!achievementsTable[1].unlocked &&
                statsTable[5].data >= 1) {
                myDB.quickReplace(
                    ACHIEVEMENTS_TABLE_NAME,
                    1,
                    'unlocked',
                    true
                );
            }
        },

        /**
         * Gets the data at the index given.
         *
         * @param {number} id The id of the row to get.
         */
        getData: function(id) {
            return this._data[id].data;
        },

        /**
         * Probably not going to be used but just in case, added a setter.
         *
         * @param {number} id The id of the row update.
         * @param {mixed} value The value to update data to.
         */
        setData: function(id, value) {
            this._data[id].data = value;
        },

        /**
         * Increments the data property at the index given.
         *
         * @param {number} id The id of the row update.
         */
        incrementData: function(id) {
            if (this._data[id].data == null) {
                this._data[id].data = 0;
            }
            else {
                ++this._data[id].data;
            }
        },

        /**
         * Decrements the data property at the index given.
         *
         * @param {number} id The id of the row update.
         */
        decrementData: function(id) {
            if (this._data[id].data == null) {
                this._data[id].data = 0;
            }
            else {
                --this._data[id].data;
            }
        }
    };
}(cp));
