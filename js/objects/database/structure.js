var dbStructure = [
    {
        /** @type {string} The table is the section of the database that contains the following data */
        table: 'options',

        /**
         * @type {string} This is the key that your database uses to lookup info. For
         * example, to search for a player's name, you would have to request 'name'
        **/
        keyPath: 'id',

        /** @type {object} Declare the index, it will speed up searches */
        index: [
            {
                name: 'id',
                unique: true
            }
        ],

        /** @type {object} Keypath must be first or all lookups will fail */
        data: [
            {
                info: 'particle generation',
                data: true,
                id: 0
            },
            {
                info: 'skip cutscenes',
                data: false,
                id: 1
            },
            {
                info: 'automatic fullscreen',
                data: false,
                id: 2
            },
            {
                info: 'show hitboxes',
                data: false,
                id: 3
            }
        ]
    },
    {
        table: 'stats',
        keyPath: 'id',
        index: [
            {
                name: 'id',
                unique: true
            }
        ],
        data: [
            {
                info: 'playtime',
                data: 0,
                id: 0
            },
            {
                info: 'minion kills',
                data: 0,
                id: 1
            },
            {
                info: 'boss kills',
                data: 0,
                id: 2
            },
            {
                info: 'bullets fired',
                data: 0,
                id: 3
            },
            {
                info: 'special attacks',
                data: 0,
                id: 4
            },
            {
                info: 'levels complete',
                data: 0,
                id: 5
            },
            {
                info: 'deaths',
                data: 0,
                id: 6
            },
            {
                info: 'total score',
                data: 0,
                id: 7
            }
        ]
    },
    {
        table: 'achievements',
        keyPath: 'id',
        index: [
            {
                name: 'id',
                unique: true
            }
        ],
        data: [
            {
                id: 0,
                name: 'button masher',
                desc: 'Shoot over 10000 bullets, hopefully you hit something...',
                unlocked: false
            },
            {
                id: 1,
                name: 'cyberspace surfer',
                desc: 'Beat level 1 by getting out of cyberspace',
                unlocked: false
            },
            {
                id: 2,
                name: 'hello noob',
                desc: 'Complete the tutorial',
                unlocked: false
            },
            {
                id: 3,
                name: 'lord of the pixel',
                desc: 'Complete each level 3 times, must have been a while',
                unlocked: false
            }
        ]
    },
    {
        table: 'levels',
        keyPath: 'level',
        index: [
            {
                name: 'level',
                unique: true
            }
        ],
        data: [
            {
                level: 1,
                name: 'lv1 - cyberspace',
                unlocked: true
            },
            {
                level: 2,
                name: 'lv2 - nodeville',
                unlocked: false
            },
            {
                level: 3,
                name: 'lv3 - server grid',
                unlocked: false
            }
        ]
    }
];