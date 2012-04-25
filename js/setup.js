/*------------
Running The Game
-----------*/
// You can overwrite any of the core in start() and init here before firing onload
var MyEngine = Engine.extend({
    width: 500,
    height: 500,
    score: 20,
    scoreEnemy: 5,
    objects: [
        'player',
        'hazard',
        'background',
        'powerup',
        'instructions',
        'director'
    ]
});

// Create and activate your personal engine
var Game = new MyEngine();
Game.setup();
