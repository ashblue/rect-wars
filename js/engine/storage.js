/*
Name: Local Storage API Access
Version: 1
Desc: Allows you to save, update, and change local storage data
on the fly.

Reference: https://developer.mozilla.org/en/DOM/Storage

Example usage:
- Save
  cp.storage.save('name', 'Joe');

- Remove
  cp.storage.remove('name');

- Get
  cp.storage.get('name');
*/

var cp = cp || {};

(function(cp) {
    var _support = function() {
        try {
            cp.storage.save('test', 'asdf');
            cp.storage.remove('test');
            return true;
        } catch(e) {
            return false;
        }
    },
    
    // Storage location for quicker access to web storage data
    // Source: http://jsperf.com/web-storage-retrieval
    _cache,
    
    _buildCache = function() {
        // Reset current cache
        _cache = {};

        // Start loop
        for (var i = sessionStorage.length; i--;) {
            // Get the storage key
            var key = sessionStorage.key(i);

            // Get the result
            var result = sessionStorage.getItem(key);

            // Dump gathered data into JSON object
            _cache[key] = result;
        }
        
        return;
    };

    cp.storage = {
        init: function() {
            if (! _support) {
                return alert('Local storage is broken or disabled, please enable it to continue.');
            }
            
            _buildCache(); 
            
            return this;
        },

        // Saves the passed parameter with a key or tag reference
        save: function(key, value) {
            // Set local storage data internally
            sessionStorage.setItem(key, value);
            
            // Set cached value
            _cache[key] = value;
            
            return this;
        },

        // Gets select data, should be using build to retrieve
        get: function(key) {
            return _cache[key];
        },

        // Removes the passed paramater
        remove: function(key) {
            // Set local data
            sessionStorage.removeItem(key);
            
            // Delete cached key
            delete _cache[key];
            
            return this;
        }
    };
}(cp));