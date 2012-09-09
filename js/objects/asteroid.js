cp.template.Asteroid = cp.template.Entity.extend({
    type: 'b',
    width: 300,
    height: 300,
    radius: 150,
    x: cp.core.width / 2,
    y: 150,
    rotation: 0,
    active: true,
    speed: 1,
    rotationSpeed: 0,
    maxRotationSpeed: 0,
    minRotationSpeed: 3,
    color: '#7F007F',
    min_radius: 10,
    max_radius: 150,
    points: [],

    /**
     * options: {
     * }
     */
    init: function(options) {
        console.log("asteroid");
        this.createAsteroidShape();

        this.x = cp.math.random(0, cp.core.gameWidth);
        this.y = -this.height;

        this.rotationSpeed = cp.math.degreesToRadians(cp.math.random(this.minRotationSpeed, this.maxRotationSpeed));
    },

    update: function() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    },

    createAsteroidShape: function() {
        // pick a random radius size
        this.radius = cp.math.random(this.max_radius, this.min_radius);

        this.width = this.height = this.radius * 2;

        var numPoints = cp.math.random(12,3);
        this.points = [];
        for (var i = 0; i < numPoints; i++){
            var r1 = cp.math.random(0,this.radius) - this.radius/2;
            var r2 = cp.math.random(0,this.radius) - this.radius/2;
            var x = this.radius * Math.sin(i * Math.PI / (numPoints / 2)) + r1;
            var y = this.radius * Math.cos(i * Math.PI / (numPoints / 2)) + r2;

            this.points.push([x, y]);
        }
    },

    drawPoints: function() {
        var center_x = this.x+this.width/2;
        var center_y = this.y+this.height/2;

        // draw box
        //cp.ctx.fillStyle = '#f0f';
        //cp.ctx.fillRect(this.x, this.y, this.width, this.height);

        // draw center
        //cp.ctx.fillStyle = '#ff0';
        //cp.ctx.fillRect(center_x-2, center_y-2, 4, 4);

        cp.ctx.save();
        cp.ctx.translate(center_x,center_y);
        cp.ctx.rotate(this.rotation);

        cp.ctx.strokeStyle = '#fff';

        cp.ctx.fillStyle = '#000';
        cp.ctx.lineWidth = 1;
        cp.ctx.beginPath();
        cp.ctx.moveTo(this.points[0][0], this.points[0][1]);

        for (var i = this.points.length; i--;){
            cp.ctx.lineTo(this.points[i][0], this.points[i][1]);
            cp.ctx.stroke();
        }

        cp.ctx.closePath();
        //cp.ctx.stroke();
        cp.ctx.fill();

        cp.ctx.restore();
    },

    draw: function() {
        this._super();
        //first attempt
        //this.drawRandomPolygon4();

        //second attempt
        //this.drawRandomPolygon();

        //the following is the second attempt but split up and refined

        //this is for debugging the shape
        //it will create a new asteroid shape every frame!
        //this.createAsteroidShape();

        this.drawPoints();
    },

    drawRandomPolygon: function() {

        // draw box
        cp.ctx.fillStyle = '#f0f';
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);

        var center_x = this.x+this.width/2;
        var center_y = this.y+this.height/2;

        // draw center
        cp.ctx.fillStyle = '#ff0';
        cp.ctx.fillRect(center_x-2, center_y-2, 4, 4);

        var min_radius = 10;
        var max_radius = this.width/2;

        // pick a random radius size
        var radius = cp.math.random(max_radius, min_radius);

        // how many verticies in this asteroid
        var numPoints = cp.math.random(12,3);

        // pick random position
        //var x = this.random.next();
        //var y = this.random.next();

        // pick a random rotation angle
        //var angle = this.random.next() * Math.PI;

        // function to return a random point
        //function randomPoint(random) {
        //	return random.next() * radius - radius/2;
        //}

        // pick a bunch of points for our asteroid verticies
        var r1 = cp.math.random(radius) - radius/2;
        var r2 = cp.math.random(radius) - radius/2;
        var x = radius * Math.sin(0 * Math.PI / (numPoints / 2)) + r1;
        var y = radius * Math.cos(0 * Math.PI / (numPoints / 2)) + r2;

        cp.ctx.strokeStyle = '#0f0';
        cp.ctx.lineWidth = 1;
        cp.ctx.beginPath();
        cp.ctx.moveTo(x + center_x, y + center_y);

        for (var i = 1; i < numPoints; i++){
            var r1 = cp.math.random(radius) - radius/2;
            var r2 = cp.math.random(radius) - radius/2;
            var x = radius * Math.sin(i * Math.PI / (numPoints / 2)) + r1;
            var y = radius * Math.cos(i * Math.PI / (numPoints / 2)) + r2;

            cp.ctx.lineTo(x + center_x, y + center_y);
            cp.ctx.stroke();
        }

        cp.ctx.closePath();
        cp.ctx.stroke();
    },

    drawRandomPolygon4: function() {
        // draw box
        cp.ctx.fillStyle = '#f0f';
        cp.ctx.fillRect(this.x, this.y, this.width, this.height);

        var center_x = this.x+this.width/2;
        var center_y = this.y+this.height/2;

        // draw center
        cp.ctx.fillStyle = '#ff0';
        cp.ctx.fillRect(center_x-2, center_y-2, 4, 4);

        var min_radius = 10;
        var max_radius = this.width/2;

        var radians = cp.math.degreesToRadians(30);

        var line1_length = cp.math.random(this.max_radius, this.min_radius);
        var p1_x = center_x - (Math.cos(radians) * line1_length);
        var p1_y = center_y - (Math.sin(radians) * line1_length);

        //draw line 1
        cp.ctx.strokeStyle = '#0f0';
        cp.ctx.lineWidth = 1;
        cp.ctx.beginPath();
        cp.ctx.moveTo(center_x, center_y);
        cp.ctx.lineTo(p1_x, p1_y);
        cp.ctx.stroke();

        var line2_length = cp.math.random(max_radius, min_radius);
        var p2_x = center_x + (Math.cos(radians) * line2_length);
        var p2_y = center_y - (Math.sin(radians) * line2_length);

        //draw line 2
        cp.ctx.strokeStyle = '#0f0';
        cp.ctx.lineWidth = 1;
        cp.ctx.beginPath();
        cp.ctx.moveTo(center_x, center_y);
        cp.ctx.lineTo(p2_x, p2_y);
        cp.ctx.stroke();


        var line3_length = cp.math.random(max_radius, min_radius);
        var p3_x = center_x + (Math.cos(radians) * line3_length);
        var p3_y = center_y + (Math.sin(radians) * line3_length);

        //draw line 3
        cp.ctx.strokeStyle = '#0f0';
        cp.ctx.lineWidth = 1;
        cp.ctx.beginPath();
        cp.ctx.moveTo(center_x, center_y);
        cp.ctx.lineTo(p3_x, p3_y);
        cp.ctx.stroke();


        var line4_length = cp.math.random(max_radius, min_radius);
        var p4_x = center_x - (Math.cos(radians) * line4_length);
        var p4_y = center_y + (Math.sin(radians) * line4_length);

        //draw line 4
        cp.ctx.strokeStyle = '#0f0';
        cp.ctx.lineWidth = 1;
        cp.ctx.beginPath();
        cp.ctx.moveTo(center_x, center_y);
        cp.ctx.lineTo(p4_x, p4_x);
        cp.ctx.stroke();


        //draw outline
        cp.ctx.strokeStyle = '#0ff';
        cp.ctx.lineWidth = 1;
        cp.ctx.beginPath();
        cp.ctx.moveTo(p1_x, p1_y);
        cp.ctx.lineTo(p2_x, p2_y);
        cp.ctx.lineTo(p3_x, p3_y);
        cp.ctx.lineTo(p4_x, p4_x);
        cp.ctx.closePath();
        cp.ctx.stroke();
    },

    collide: function(object) {
        object.hp -= 1;
        this.kill();
    }
});