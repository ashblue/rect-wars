/**
 * @fileoverview The object that will house all stats functionality.
 * @author gkoehl@nerdery.com (Gary Koehl)
 */

(function(cp) {
    /** @type {string} Holds the table name */
    var TABLE_NAME = 'stats';

    /**
     * The stats object
     */
    cp.stats = {
        /**
         *    @type {array} Holds a copy of the database table rows
         */
        _data: null,

        /**
         * The stats object
         */
        init: function() {
            this.resetData();
        },

        /**
         * Resets the _data property the current state of the database
         */
        resetData: function() {
            statsTable = myDB.getTable(TABLE_NAME);
            this._data = statsTable;
        },

        /**
         * Updates the database with the current _data property
         */
        saveData: function() {
            var index = 0;
            var dataLength = this._data.length;
            for (; index < dataLength; index++) {
                myDB.quickReplace(
                    TABLE_NAME,
                    index,
                    'data',
                    this._data[index].data
                );
            }
        },

        /**
         * Gets the data at the index given
         *
         * @param {number} id The id of the row to get
         */
        getData: function(id) {
            return this._data[id].data;
        },

        /**
         * Probably not going to be used but just in case, added a setter
         *
         * @param {number} id The id of the row update
         * @param {mixed} value The value to update data to
         */
        setData: function(id, value) {
            this._data[id].data = value;
        },

        /**
         * Increments the data property at the index given
         *
         * @param {number} id The id of the row update
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
         * Decrements the data property at the index given
         *
         * @param {number} id The id of the row update
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
