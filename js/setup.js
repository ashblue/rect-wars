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
        'instructions',
        'director'
    ]
});
   
// Create and activate your personal engine
var Game = new MyEngine();
Game.setup();
    
// Animation must be kept seperate due to a DOM error caused by self-reference in your objects
function animate() {
    requestAnimFrame( animate );
    Game.draw();
}
animate();