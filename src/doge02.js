/*global Phaser, preload, create, update*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'box', { preload: preload, create: create, update: update });


function preload() {
    "use strict";
    game.load.image('stars', 'bin/stars.png');
    game.load.image('moon', 'bin/moon.png');
    game.load.image('peerCoin', 'bin/peerCoin.png');
    game.load.image('bitCoin', 'bin/bitCoin.png');
    game.load.image('liteCoin', 'bin/liteCoin.png');
    game.load.image('dogeCoin', 'bin/dogeCoin');
}

var stars,
    moon,
    bg,
    
    badCoins,
    peerCoin,
    liteCoin,
    bitCoin,
    dogeCoin,

    nowTime = 500;


function create() {
    "use strict";
    bg = game.add.sprite(game.width / 2, game.height / 2, 'stars');
    bg.anchor.setTo(0.5, 0.5);
    bg.body.immovable = true;
    bg.fixedToCamera = true;
    
    badCoins = game.add.group();
}


function update() {
    //collides
    //starts game
    //lets stuff move
    //spawns new coins
    //update text?
}