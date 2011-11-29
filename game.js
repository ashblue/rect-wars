window.onload = function() {
        /*------------
        Running The Game 
       ------------*/
       // You can overwrite any of the core in start() and init here before firing onload
        var Game = new Core({ width:500, height:500, score: 20, scoreEnemy: 5 });

        /*------------
         Entity Objects
        ------------*/
        // example
        var Player = Entity.extend({
                width: 30,
                height: 30,
                x: Game.width / 2,
                y: Game.height - 50,
                active: true,
                speed: 3,
                delay: -1,
                
                init: function() {
                        // Put keyboard info on core
                        window.addEventListener('keydown', this.keyboardDown, true);
                        window.addEventListener('keyup', this.keyboardUp, true);
                },
                // Put keyboard info on core
                keyboardDown: function(event) {
                        switch(event.keyCode) {
                                case 37: // Left
                                        Game.left = true;
                                        break;
                                case 39: // Right
                                        Game.right = true;
                                        break;
                                case 32: // Spacebar
                                        Game.space = true;
                                        break;
                                default:
                                        break;
                        }
                },
                keyboardUp: function(event) {
                        switch(event.keyCode) {
                                case 37: // Left
                                        Game.left = false;
                                        break;
                                case 39: // Right
                                        Game.right = false;
                                        break;
                                case 32: // Spacebar
                                        Game.space = false;
                                        break;
                                default:
                                        break;
                        }
                },
                update: function() {
                        // Movement
                        if (Game.left && this.x > 0)
                                this.x -= this.speed;
                        else if (Game.right && this.x < Game.width - this.width)
                                this.x += this.speed;
                                
                        // Shoot
                        if (Game.space && this.delay < 0) {
                                spawnEntity(Laser, this.x + (this.width / 2), this.y);
                                this.delay = 20;
                        }
                        else {
                                this.delay -= 1;
                        }
                },
                draw: function() {
                        // Change to a triangle later
                        ctx.fillStyle = '#000';
                        ctx.fillRect(this.x, this.y, this.width, this.height);
                }
        });
        var Laser = Entity.extend({
                width: 2,
                height: 14,
                speed: 5,
                update: function() {
                        this.y -= 5;
                        if (this.y < 0) this.kill();
                },
                draw: function() {
                        // Change to a triangle later
                        ctx.fillStyle = '#000';
                        ctx.fillRect(this.x, this.y, this.width, this.height);
                }
        });
        
        // randomly spawn x-axis
        var Hazard = Entity.extend({
                width: 20,
                height: 20,
                y: -20,
                speedMin: 2,
                speedMax: 6,
                active: true,
                init: function() {
                        this.speed = random(this.speedMax, this.speedMin);
                        this.alpha = random(9,5) * .1;
                },
                update: function() {
                        if (this.y > canvas.height) { this.kill(); }
                        else { this.y += this.speed }
                },
                draw: function() {
                        ctx.fillStyle = '#777';
                        ctx.globalAlpha = this.alpha;
                        ctx.fillRect(this.x,this.y,this.width,this.height);
                        ctx.globalAlpha = 1;
                }
        });
        var HazardGen = Entity.extend({
                delayMin: 2,
                delayMax: 40,
                delay: 60,
                count: 0,
                update: function() {
                        if (this.count > this.delay) {
                                this.count = 0;
                                this.delay = random(this.delayMax,this.delayMin);
                                spawnEntity(Hazard, random(480), -20);
                        }
                        else {
                                this.count += 1;
                        }
                }
        });
        
        var Score = Entity.extend({
                width: 5,
                x: 0,
                y: 0,
                draw: function() {
                        // Your score
                        this.height = Game.height * (Game.score * .01);
                        ctx.fillStyle = '#000';
                        ctx.fillRect(this.x, this.y, this.width, this.height);
                        
                        // Top score
                        this.height = Game.height * (Game.scoreEnemy * .01);
                        ctx.fillStyle = '#f00';
                        ctx.fillRect(this.x + 5, this.y, this.width, this.height);
                }
        });
        
        
        /*------------
         Entity Spawning
        ------------*/
        spawnEntity(HazardGen);
        spawnEntity(Player);
        spawnEntity(Score);
}