/**
 * @requires models/leveldata.js
 */
(function (cp) {
    cp.template.Level1 = cp.template.Entity.extend({
        name: 'level1',

        init: function () {
            // Used to determine the width of the game's play area
            this.bind();

            cp.game.spawn('Background');
            cp.game.spawn('Player');
            cp.game.spawn('Director');
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