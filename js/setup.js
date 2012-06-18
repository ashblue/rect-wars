/*------------
Running The Game 
-----------*/
console.log(cp);

// Enable debug mode
cp.debug.active = true;

// List of scripts to load from js/objects
cp.load.objects = ['background', 'player', 'hazard', 'director', 'bullet', 'drone', 'powerup'];

// init(width, height, run onLoad function)
cp.core.init(700, 700, function() {
    // Keyboard key configuration
    cp.input.bind('arrowUp', 'up');
    cp.input.bind('arrowDown', 'down');
    cp.input.bind('arrowLeft', 'left');
    cp.input.bind('arrowRight', 'right');
    cp.input.bind('x', 'shoot');
    
    // Spawn objects
    cp.game.spawn('Background');
    cp.game.spawn('Player');
    cp.game.spawn('Director');
	cp.game.spawn('PowerupShield');
	cp.game.spawn('PowerupLaBomba');
});