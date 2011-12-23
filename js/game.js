window.onload = function() {
    /*------------
    Running The Game 
   ------------*/
   // You can overwrite any of the core in start() and init here before firing onload
    var MyEngine = Engine.extend({
        width:500,
        height:500,
        score: 20,
        scoreEnemy: 5
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

    /*------------
     Entity Objects
    ------------*/
    // example
    var Player = Entity.extend({
        type: 'a',
        width: 30,
        height: 30,
        x: Game.width / 2,
        y: Game.height - 50,
        active: true,
        speed: 3,
        delay: -1,
        hp: 10,
        color: '#eee',
        
        collide: function(object) {
            //this.kill();
            object.kill();
        },
        init: function() {
                // Put keyboard info on core
                window.addEventListener('keydown', this.keyboardDown, true);
                window.addEventListener('keyup', this.keyboardUp, true);
        },
        // On upgrade remove keyboard info and refactor. Currently its built into the core.
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
                        Game.spawnEntity(Laser, this.x + (this.width / 2), this.y);
                        this.delay = 20;
                }
                else {
                        this.delay -= 1;
                }
        },
        draw: function() {
                // Change to a triangle later
                Game.ctx.fillStyle = this.color;
                Game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    });
    var Laser = Entity.extend({
        type: 'a',
        width: 2,
        height: 14,
        speed: 5,
        color: '#eee',
        collide: function(object) {
            object.hp -= 1;
            this.kill();
        },
        update: function() {
            this.y -= 5;
        },
        draw: function() {
            // Change to a triangle later
            Game.ctx.fillStyle = this.color;
            Game.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    });
    
    // randomly spawn x-axis
    var Hazard = Entity.extend({
        type: 'b',
        width: 20,
        height: 20,
        speedMin: 2,
        speedMax: 6,
        init: function() {
            this.speed = Game.random(this.speedMax, this.speedMin);
            this.alpha = Game.random(9,5) * .1;
            this.partCount = Game.random(12,7);
        },
        update: function() {
            if (this.hp < 1) this.kill();
            
            if (this.y > Game.canvas.height) { this.kill(); }
            else { this.y += this.speed }
        },
        collide: function(object) {
            for(var obj = this.partCount; obj > 0; obj--) {
                Game.spawnEntity(HazardMini, this.x, this.y);
            }
        },
        draw: function() {
                Game.ctx.fillStyle = '#777';
                Game.ctx.globalAlpha = this.alpha;
                Game.ctx.fillRect(this.x,this.y,this.width,this.height);
                Game.ctx.globalAlpha = 1;
        },
        kill: function() {
            this._super();
        }
    });
    var HazardMini = Entity.extend({
        width: 5,
        height: 5,
        speedMin: 2,
        speedMax: 6,
        init: function() {
            // needs a random 1 or -1
            this.speedX = Game.random(this.speedMax, this.speedMin) * Game.randomPosNeg();
            this.speedY = Game.random(this.speedMax, this.speedMin) * Game.randomPosNeg();
            
            this.alpha = Game.random(7,3) * .1;
        },
        update: function() {            
            if (this.alpha <= .02) {
                this.kill();
            }
            else {
                this.life -= 1;
                this.alpha -= .02;
                this.x += this.speedX;
                this.y += this.speedY;
            }
        },
        draw: function() {
            Game.ctx.fillStyle = '#777';
            Game.ctx.globalAlpha = this.alpha;
            Game.ctx.fillRect(this.x,this.y,this.width,this.height);
            Game.ctx.globalAlpha = 1;
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
                        this.delay = Game.random(this.delayMax,this.delayMin);
                        Game.spawnEntity(Hazard, Game.random(480), -20);
                }
                else {
                        this.count += 1;
                }
        }
    });
    
    var Background = Entity.extend({
        timerDef: 60,
        init: function() {
            this.timer = this.timerDef;
        },
        update: function() {
            if (this.timer < 1) {
                Game.spawnEntity(Star, 0, 0);
                this.timer = Game.random(this.timerDef);
            }
            else {
                this.timer -= 1;
            }
        },
        draw: function() {
            Game.ctx.fillStyle = '#111';
            Game.ctx.fillRect(this.x,this.y,Game.canvas.width,Game.canvas.height);
        }
    });
    var Star = Entity.extend({
        speed: .5,
        init: function() {
            this.width = Game.random(3, 1);
            this.height = Game.random(3, 1);
            this.x = Game.random(Game.canvas.width);
            this.alpha = Game.random(7,3) * .1;
        },
        update: function() {
            this.y += .5;
        },
        draw: function() {
            Game.ctx.fillStyle = '#eee';
            Game.ctx.globalAlpha = this.alpha;
            Game.ctx.fillRect(this.x,this.y,this.width,this.height);
            Game.ctx.globalAlpha = 1;
        }
    });
    
    var Instructions = Entity.extend({
        x: 5,
        y: 15,
        draw: function() {
            Game.ctx.fillStyle = '#aaa';
            Game.ctx.font = '12px arial';
            Game.ctx.fillText('Tech Demo | Shoot: Space | Move: Arrows | FPS: ' + Game.fps, this.x, this.y);
        }
    });
    
    //var Score = Entity.extend({
    //        width: 5,
    //        x: 10,
    //        y: 10,
    //        draw: function() {
    //            
    //                // Your score
    //                this.height = Game.canvas.height * ( Game.score * .01 );
    //                Game.ctx.fillStyle = '#000';
    //                Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    //                
    //                // Top score
    //                this.height = Game.height * (Game.scoreEnemy * .01);
    //                Game.ctx.fillStyle = '#f00';
    //                Game.ctx.fillRect(this.x + 5, this.y, this.width, this.height);
    //        }
    //});
    
    
    /*------------
     Entity Spawning
    ------------*/
    Game.spawnEntity(Background);
    Game.spawnEntity(HazardGen);
    Game.spawnEntity(Player);
    Game.spawnEntity(Instructions);
}