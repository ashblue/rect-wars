/*------------
Running The Game
-----------*/
// You can overwrite any of the core in start() and init here before firing onload
var MyEngine = Engine.extend({
    width: 700,
    height: 700,
    score: 20,
    scoreEnemy: 5,
    objects: [
        'bullet',
        'drone',
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
