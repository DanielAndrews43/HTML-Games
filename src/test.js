/*global Phaser, preload, create, update */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'box', { preload: preload, create: create, update: update});
 
function preload() {

    "use strict";
    
    game.load.image('logo', 'bin/logo.png');
    game.load.image('paddle', 'bin/paddle.png');
    game.load.image('ball', 'bin/ball.png');
    game.load.image('endGameButton', 'bin/endGameButton.png');
	
}
var moon,
    nowTime = 1000,
    text;

function create() {
    "use strict";
    
    game.background
    
    moon = game.add.sprite(0, 0, 'logo');
    moon.anchor.setTo(0.5, 0.5);
    
    text = game.add.text(game.width / 2, game.height / 2, 'Hello');
}

function newText() {
    "use strict";
    text.setText('Cool story bro' + game.time.now);
    nowTime = game.time.now + 1000;
}

function update() {
    "use strict";
    if (game.time.now > nowTime) {
        newText();
    }
}