var myDB = myDB || {};

(function (myDB) {
    /**
     * Handles all cross-browser solutions to keep the logic consolidated to
     * a single file. Idea is to make adding/removing support easier as the
     * specification changes.
     */
    myDB.support = {
        /**
         * Configures all the prefixes for browsers that don't properly support indexedDB
         * @returns {self}
         */
        setPrefixes: function () {
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
            return this;
        },

        /**
         * Tests if the current browser can support indexedDB
         * @param {function} Callback executed if loading fails
         * @returns {boolean} True on success, false on failure
         */
        testDb: function (callback) {
            if (window.indexedDB === undefined) {
                callback();
                return false;
            }

            return true;
        },

        /**
         * Detects if the IndexedDB implementation uses setVersion, for older implementations
         */
        hasSetVersion: function (e) {
            return Object.
                getPrototypeOf(e.target.result).
                hasOwnProperty('setVersion');
        },

        /**
         * Upgrade database for old browsers
         */
        upgradeDBFix: function (e, newVersion, prevVersion, callback) {
            if (this.hasSetVersion(e)) {
                // Begin a possible upgrade
                var setVer = e.target.result.setVersion(newVersion);

                // Logic on successful update
                setVer.onsuccess = function (event) {
                    if (newVersion > prevVersion || isNaN(prevVersion)) {
                        callback(event);
                    }
                };
            }
        }
    };

}(myDB));
var myDB = myDB || {};

(function (myDB) {
    /** @type {object} Reference to master object */
    var SELF = null;

    /** @type {object} Holds a cache of the database. */
    var _data = null;

    /** @type {function} Storage location for timer */
    var _updateCheck = null;

    myDB.cache = {
        init: function () {
            if (SELF !== null) {
                return this;
            }

            SELF = this;

            return this;
        },

        setCache: function (writeData, db) {
            _data = {};

            // Loop through all of the data items
            for (var i = writeData.length; i--;) {
                var table = writeData[i].table;
                _data[table] = [];

                // getTable for each with a callback that appends to the cache
                db.getTable(table, function(e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        _data[cursor.source.name].push(cursor.value);
                        cursor.continue();
                    }
                });
            }
        },

        setCacheLine: function (table, key, keyValue, writeValue) {
            var tableData = _data[table];

            for (var i = tableData.length; i--;) {
                if (tableData[i][key] === keyValue) {
                    return _data[table][i] = writeValue;
                }
            }

            return {};
        },

        setCacheTimer: function(checkVal, writeData, db) {
            var checkStatus = function() {
                if (checkVal) {
                    SELF.setCache(writeData, db);
                } else {
                    _updateCheck = setTimeout(checkStatus, 100);
                }
            };
            _updateCheck = setTimeout(checkStatus, 100);
        },

        getCache: function () {
            return _data;
        }
    };

    myDB.cache.init();
}(myDB));
var myDB = myDB || {};

(function (myDB) {
    //function (support, cache) {
    /** @type {object} Reference to master database object */
    var SELF = null;

    /** @type {string} Name of the database */
    var _name = null;

    /** @type {number} Version of the database */
    var _version = null;

    /** @type {number} Previous version of the database */
    var _versionPrev = null;

    /** @type {object} JSON object source used to create the database and upgrade it */
    var _writeData = null;

    /** @type {object} Instance of the database */
    var _db = null;

    /** @type {object} Record the original request data */
    var _request = null;

    var _writeComplete = false;

    var _private = {
        /**
         * Retrieves the data necessary to write to the database
         */
        getWriter: function (e) {
            return _db || e.target.result;
        },

        /**
         * Request the database
         */
        requestDB: function () {
            return window.indexedDB.open(_name, _version);
        },

        /**
         * Creates the database structure from the init data
         */
        setStructure: function (e) {
            var tableStore, index, line, unique, indexString;
            for (var i = _writeData.length; i--;) {
                // Create the table
                tableStore = _private
                    .getWriter(e)
                    .createObjectStore(_writeData[i].table, { keyPath: _writeData[i].keyPath });

                // Create necessary index
                if (_writeData[i].index) {
                    for (index = _writeData[i].index.length; index--;) {
                        unique = _writeData[i].index[index].unique || false;
                        indexString = _writeData[i].index[index].name;
                        tableStore.createIndex(indexString, indexString, { unique: unique });
                    }
                }

                // Insert lines
                for (line = _writeData[i].data.length; line--;) {
                    tableStore.add(_writeData[i].data[line]);
                }
            }

        },

        /**
         * Sets the previous version retrieved form the database
         */
        setVersionPrev: function (ver) {
            _versionPrev = parseInt(ver, 10);
        },

        /**
         * Logic for upgrading the database if a structure is already in place
         */
        upgradeStructure: function (e) {
            var tableStore, index, line, unique, indexString;
            for (var i = _writeData.length; i--;) {
                // Test if the table already exists
                try {
                    tableStore = e.currentTarget.transaction.objectStore(_writeData[i].table);

                    // On success Loop through and run get commands on all the data
                    for (line = _writeData[i].data.length; line--;) {
                        var key = _writeData[i].index[0].name;
                        var getData = tableStore.get(_writeData[i].data[line][key]);

                        // On get success ignore it
                        getData.onsuccess = (function (e) {
                            var iCurrent = i;
                            var lineCurrent = line;

                            return function (e) {
                                var result = e.target.result;

                                if (result !== undefined) {
                                    return;
                                }
                                tableStore.add(_writeData[iCurrent].data[lineCurrent]);
                            };
                        })();
                    }

                // On table retrieval failure create the table and all the attached data
                } catch (error) {
                    tableStore = _private
                        .getWriter(e)
                        .createObjectStore(_writeData[i].table, { keyPath: _writeData[i].keyPath });

                    // Create necessary index
                    if (_writeData[i].index) {
                        for (index = _writeData[i].index.length; index--;) {
                            unique = _writeData[i].index[index].unique || false;
                            indexString = _writeData[i].index[index].name;
                            tableStore.createIndex(indexString, indexString, { unique: unique });
                        }
                    }

                    // Insert lines
                    for (line = _writeData[i].data.length; line--;) {
                        tableStore.add(_writeData[i].data[line]);
                    }
                }
            }
        },

        /**
         * Sets up database error handeling and records the current database
         */
        setDB: function () {
            _db = _request.result;

            _db.onerror = function (e) {
                console.error('Database error: ' + e.target.errorCode);
            };

            _writeComplete = true;
        }
    };

    var _events = {
        /**
         * Request error handeling
         */
        requestError: function (e) {
            console.error ('IndexedDB request crashed, database asked for could not be retrieved');
        },

        /**
         * Request upgrade needed
         */
        requestUpgrade: function (e) {
            try {
                _private.setStructure(e);
            } catch (error) {
                _private.upgradeStructure(e);
            }
        },

        /**
         * Request was successful
         */
        requestSuccess: function (e) {
            _private.setVersionPrev(e.target.result.version);

            // For older browsers that need to upgrade the DB during success
            myDB.support.upgradeDBFix(e, _version, _versionPrev, _events.requestUpgrade);

            // Store the retrieved database result
            _private.setDB();

            // Set the database cache if the version isn't changing
            if (_version === _versionPrev) {
                myDB.cache.setCache(_writeData, SELF);

            // Database is still updating, check back later
            } else {
                myDB.cache.setCacheTimer(_writeComplete, _writeData, SELF);
            }
        }
    };

    myDB.getDB = {
        init: function (name, version, writeData) {
            if (SELF !== null) {
                return this;
            }

            SELF = this;

            _name = name;
            _version = version;
            _writeData = writeData;

            return this;
        },

        request: function (name, version, writeData) {
            this.init(name, version, writeData);

            // Create the request
            _request = _private.requestDB();

            // Attach error handeling
            _request.onerror = _events.requestError;

            // Attach upgrade logic
            _request.onupgradeneeded = _events.requestUpgrade;

            // Attach success handeling
            _request.onsuccess = _events.requestSuccess;

            return this;
        },

        /**
         * Use a retrieved database to open a transaction for a specific table
         */
        getTable: function (table, callback) {
            var objectStore = _db.transaction(table).objectStore(table);

            return objectStore.openCursor().onsuccess = callback;
        },

        /**
         * Accesses the cache and returns the array of data for a table
         * @param {string} table Table to access
         * @returns {array} Each line in the array reprents a line in the database
         */
        getDataTable: function(table) {
            var cacheData = myDB.cache.getCache();
            return cacheData[table];
        },

        /**
         * Gets and returns a specific line of a table via a key with a value from
         * the cache.
         * @param {string} table Name of the table such as 'player'
         * @param {string} key Main key for the table, such as 'id'
         * @param {mixed} value Value you are looking for in a specific key,
         * for example you might look for a key of 'name' and value of 'Joe'
         * @returns {object} Only returns one line or an empty object
         */
        getDataTableKey: function(table, key, value) {
            var cacheData = myDB.cache.getCache();
            var tableData = cacheData[table];

            for (var i = tableData.length; i--;) {
                if (tableData[i][key] === value) {
                    return tableData[i];
                }
            }

            return {};
        },

        /**
         * Modify an existing line of data in a table.
         * @param {string} table Name of the table such as 'player'
         * @param {object} data Object to write, if you wanted to set a
         * 'name' key it might look like {name: 'joe'}
         * @returns {self}
         * @todo Untested
         */
        setData: function (table, key, keyName, writeData) {
            // Update the database
            var dbTransaction = _db.transaction([table], 'readwrite');
            var oStore = dbTransaction.objectStore(table);
            oStore.put(writeData);

            // Update the myDB.cache
            myDB.cache.setCacheLine(table, key, keyName, writeData);

            return this;
        }
    };
}(myDB));
/**
 * @example usage window.myDB.setDB('new', 1, yourJSONdata);
 * @todo
 */
var myDB = myDB || {};

(function (myDB) {
    /** @type {object} Reference to the db singleton */
    var SELF = null;

    /** @type {boolean} Whether or not to enable the debugger */
    var _debug = false;

    var _private = {
        /**
         * Callback in-case IndexedDB fails to initialize
         */
        loadFailure: function () {
            return alert('Your browser does not support IndexedDB');
        }
    };

    /** @type {object} Public interface for working with myDB. Directly attached to the window */
    myDB.init = function () {
        if (SELF !== null) {
            return;
        }

        SELF = this;

        myDB.support
            .setPrefixes()
            .testDb(_private.loadFailure);
    };

    /**
     * Set and get the database, should only be called once per page load.
     * @param {string} dbName Name of the database you want to retrieve
     * @param {number} ver Version of the database you want, newer versions trigger
     * an upgrade
     * @param {object} data Data you want to use to create or upgrade
     * your database, see example for more info
     * var dbData = {
     *     table: 'player',
     *     keyPath: 'name',
     *     data: [
     *         {
     *              name: null,
     *              fullscreen: false,
     *              particles: true
     *         }
     *     ]
     * };
     * @returns {self}
     */
    myDB.setDB = function (dbName, ver, data) {
        myDB.getDB.request(dbName, ver, data);

        return this;
    };

    /**
     * Overwrite the callback that fires if indexedDB fails to load
     */
    myDB.setNoDBCallback = function (callback) {
        _private.loadFailure = callback;

        return this;
    };

    /**
     * Retrive a specific table
     * @param {string} table Name of the table you want to get
     */
    myDB.getTable = function (table) {
        return myDB.getDB.getDataTable(table);
    };

    /**
     * Gets and returns a specific line of a table via a key with a value from
     * the cache.
     * @param {string} table Name of the table such as 'player'
     * @param {string} key Main key for the table, such as 'name'
     * @param {mixed} value Value you are looking for in a specific key,
     * for example you might look for a key of 'name' and value of 'Joe'
     * @returns {object} Only returns one line or an empty object
     */
    getTableLine = function (table, key, value) {
        return myDB.getDB.getDataTableKey(table, key, value);
    };

    /**
     * Modify an existing line of data in a table.
     * @param {string} table Name of the table such as 'player'
     * @param {object} data Object to write, if you wanted to set a
     * 'name' key it might look like {name: 'joe'}
     * @returns {self}
     */
    setTableLine = function (table, key, keyName, value) {
        myDB.getDB.setData(table, key, keyName, value);
        return this;
    };

    myDB.init();

}(myDB));
