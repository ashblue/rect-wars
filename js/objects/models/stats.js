/**
 * @fileoverview The object that will house all stats functionality.
 * @author gkoehl@nerdery.com (Gary Koehl)
 * @requires myDB
 * @todo Create the score counter with the following
 * - Create score DOM element html
 * - Create CSS for score
 * - Cache value of score dom elements in models/stats.js
 * - Update with death of enemies
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
        _items: null,

        /**
         * @type {number} Holds the score.
         */
        _score: null,

        /**
         * The stats object
         */
        init: function() {
            this.resetData();
        },

        /**
         * Resets the _items property the current state of the database.
         */
        resetData: function() {
            var statsTable = myDB.getTable(STATS_TABLE_NAME);
            this._items = statsTable;
            this._score = 0;
        },

        /**
         * Updates the database with the current _items property.
         */
        saveData: function() {
            var index = 0;
            var dataLength = this._items.length;
            for (; index < dataLength; index++) {
                myDB.quickReplace(
                    STATS_TABLE_NAME,
                    index,
                    'data',
                    this._items[index].data
                );
            }

            // Unlock any achievements
            this.unlockAchievements();
        },

        /**
         * Unlock achievements based on the current state of the database.
         * ENHANCEMENT: Add in event triggers
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
            return this._items[id].data;
        },

        /**
         * Probably not going to be used but just in case, added a setter.
         *
         * @param {number} id The id of the row update.
         * @param {mixed} value The value to update data to.
         */
        setData: function(id, value) {
            this._items[id].data = value;
            this.saveData();
        },

        /**
         * Get the score.
         */
        getScore: function() {
            return this._score;
        },

        /**
         * Sets the score given a value.
         *
         * @param {number} value The value to add or overwrite.
         * @param {bool} overwrite If set the value overwrites the score.
         */
        setScore: function(value, overwrite) {
            if (overwrite != null && overwrite) {
                this._score = value;
            }
            else {
                this._score += value;
            }
        },

        /**
         * Increments the data property at the index given.
         *
         * @param {number} id The id of the row update.
         */
        incrementData: function(id) {
            if (this._items[id].data == null) {
                this._items[id].data = 0;
            }
            else {
                ++this._items[id].data;
            }
            this.saveData();
        },

        /**
         * Decrements the data property at the index given.
         *
         * @param {number} id The id of the row update.
         */
        decrementData: function(id) {
            if (this._items[id].data == null) {
                this._items[id].data = 0;
            }
            else {
                --this._items[id].data;
            }
            this.saveData();
        }
    };
}(cp));
