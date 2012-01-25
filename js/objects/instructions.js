var Instructions = Entity.extend({
    x: 5,
    y: 15,
    draw: function() {
        Game.ctx.fillStyle = '#aaa';
        Game.ctx.font = '12px arial';
        Game.ctx.fillText('Tech Demo | Shoot: Space | Move: Arrows | FPS: ' + Game.fps, this.x, this.y);
    }
});