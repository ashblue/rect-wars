/**
 * @requires models/leveldata.js
 */
(function (cp) {
    cp.template.Level1 = cp.template.Entity.extend({
        name: 'level1',

        waves: [
            {entity: 'EmptyWave'},
            {entity: 'HazardWave'}, //Tutorial w/ Light asteroids
            {entity: 'EmptyWave'},
            {entity: 'DroneZaggerWave', options: {swarm: true}}, //Introduce zaggers that fly everywhere without a format
            {entity: 'EmptyWave'},
            {entity: 'DroneTurretWave'}, //Introduce turrets with light asteroids
            {entity: 'EmptyWave'},
            //{entity: 'DroneTurretWave'}, //Zaggers and turrets formatted like Space Invaders that slowly go down the screen
            //{entity: 'EmptyWave'},
            {entity: 'AsteroidWave'}, //Heavy asteroids that require dodging instead of shooting
            //{entity: 'EmptyWave'},
            //{entity: 'DroneTurretWave'}, //Introduce 3 carriers with a few zaggers
            //{entity: 'EmptyWave'},
            //{entity: 'DroneTurretWave'}, //Heavy wave of turrets
            //{entity: 'EmptyWave'},
            //{entity: 'DroneTurretWave'}, //Heavy asteroids with zaggers and turrets
            //{entity: 'EmptyWave'},
            //{entity: 'DroneTurretWave'}, //3 aircraft carrier with zaggers and turrets

            //BOSS
            // Stage 1 - full body
            // Stage 2 - head
            // Stage 3 - particles only
        ],

        init: function () {
            // Used to determine the width of the game's play area
            this.bind();

            // Toggle hitbox display from the options table.
            var hitboxOptionSetting =
                myDB.getTableData('options', 'info', 'show hitboxes');
            cp.debug.showCollisions = hitboxOptionSetting;

            // Initialize the stats object
            cp.stats.init();

            cp.game.spawn('Background');
            cp.game.spawn('Player');
            cp.game.spawn('SpecialUI');
            cp.game.spawn('Director', this.waves);
        },

        update: function () {
            return;
        },

        draw: function () {
            return;
        },

        bind: function () {
            cp.input.bind('arrowUp', 'up');
            cp.input.bind('arrowDown', 'down');
            cp.input.bind('arrowLeft', 'left');
            cp.input.bind('arrowRight', 'right');
            cp.input.bind('x', 'shoot');
            cp.input.bind('c', 'special');
        }
    });
}(cp));
