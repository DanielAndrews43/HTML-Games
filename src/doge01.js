/*global Phaser, preload, create, update, console*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'box', { preload: preload, create: create, update: update });

function preload() {
    'use strict';
    
    game.load.image('head', 'bin/dogeHead.png');
    game.load.image('dogeCoin', 'bin/dogeCoin.png');
    game.load.image('moon', 'bin/moon.png');
    game.load.image('stars', 'bin/stars.png');
    
}

var bg,
    scoreText,
    scoreString,
    endText,
    endString,
    startText,
    wordText,
    textGroup,
    endStyle,
    
    words = ['Much Doge', 'Very Crypto', 'So Money', 'Much Rich', 'TO DA MOON', 'Much Fast', 'So Community', 'So Game', 'DOOOOOGGGEEE', 'So Legit', 'Many Fun', 'Super Logical', 'So Coin', 'Many Hard'],
    colors = ['red', 'yellow', 'green', 'blue', 'pink', 'purple', 'white', 'orange', 'yellow', 'gray'],
    
    score = 0,
    coinTimer = 500,
    moonVelocity = 100,
    lives = 3,
    
    cursors,
    startKey,
    gameRunning,
    
    coin,
    bullet,
    moon,
    coins,
    player;

function create() {
    "use strict";
    
    game.world.height = 620;
    bg = game.add.sprite(game.width / 2, game.height / 2, 'stars');
    bg.fixedToCamera = true;
    
    scoreString = 'Score: ';
    scoreText = game.add.text(80, 40, scoreString + score, {fontSize: '34px', fill: '#fff'});
    scoreText.anchor.setTo(0.5, 0.5);
    
    startText = game.add.text(game.width / 2, game.height / 2, 'Very Spacebar', {font: 'bold 50px Arial', fill: '#fff'});
    startText.anchor.setTo(0.5, 0.5);
    
    endStyle = {font: 'bold 75px Arial', fill: '#000000', align: 'center', stroke: '#ffffff', thickness: 8};
    endText = game.add.text(game.width / 2, game.height / 2, endString, endStyle);
    endText.anchor.setTo(0.5, 0.5);
    
    moon = game.add.sprite(game.width / 2, 70, 'moon');
    moon.body.collideWorldBounds = true;
    moon.body.immovable = true;
    moon.anchor.setTo(0.5, 0.5);
    
    coins = game.add.group();
    coins.createMultiple(30, 'dogeCoin');
    coins.setAll('anchor.x', 0.5);
    coins.setAll('anchor.y', 1);
    coins.setAll('outOfBoundsKill', true);
    
    player = game.add.sprite(game.width / 2, game.height - 70, 'head');
    player.anchor.setTo(0.5, 0.5);
    player.body.immovable = true;
    player.body.collideWorldBounds = true;
    
    textGroup = game.add.group();
    
    cursors = game.input.keyboard.createCursorKeys();
    startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    gameRunning = false;
    
}

function dogeMessage() {
    "use strict";
    var randx = Math.random() * game.width,
        randy = Math.random() * game.height,
        randWord = words[Math.round(Math.random() * words.length)],
        randColor = colors[Math.round(Math.random() * colors.length)];
    
    wordText = game.add.text(randx, randy, randWord, {font: 'bold 35pt Arial', fill: randColor});
    textGroup.add(wordText);
    
    if (wordText.x > game.width / 2) {
        wordText.rotation = Math.random() * 3;
    } else {
        wordText.rotation = Math.random() * -3;
    }
}

function startGame() {
    "use strict";
    endText.visible = false;
    gameRunning = true;
    startText.visible = false;
    moon.body.velocity.x = 4;
    lives = 3;
    score = 0;
    textGroup.removeAll();
    scoreText.content = scoreString + score;
}

function shootCoin() {
    "use strict";
    
    if (game.time.now > coinTimer) {
        coin = coins.getFirstExists(false);
        if (coin) {
            coin.reset(moon.x, moon.y);
            coin.body.velocity.y = 300;
            coinTimer = game.time.now + 300;
        }
    }
}

function collectCoin(coin1, player1) {
    "use strict";
    player1.kill();
    
    score += 100;
    scoreText.content = scoreString + score;
    
    dogeMessage();
}

function endGame() {
    "use strict";
    
    moon.body.x = game.width / 2;
    player.body.x = game.width / 2;
    
    endText.setText("Much Over!\nVery Lose\n" + score);
    
    gameRunning = false;
}

function loseLife() {
    "use strict";
    lives -= 1;
    if (lives === 0) {
        endGame();
    }
}

function checkOut(mem) {
    "use strict";
    if (mem.y > 620) {
        mem.kill();
        loseLife();
    }
}

function update() {
    "use strict";
    
    player.body.velocity.setTo(0, 0);
    moon.body.velocity.setTo(0, 0);
    
    if (startKey.isDown && gameRunning === false) {
        startGame();
    } else if (gameRunning === true) {
        
        //Moves the player
        if (cursors.left.isDown) {
            player.body.velocity.x = -300;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 300;
        }
        
        //Makes sure the player can't go out of bounds
        if (player.x < 24) {
            player.x = 24;
        } else if (player.x > game.width - 24) {
            player.x = game.width - 24;
        }
        
        if (game.time.now > coinTimer) {
            shootCoin();
        }
        
        //Move moon around #Much Swagger
        if (moon.x < 100 || moon.x > game.width - 100) {
            moonVelocity *= -1;
            if (moonVelocity > 0) {
                moon.x += 10;
            } else {
                moon.x -= 10;
            }
        }
        moon.body.velocity.x = moonVelocity;
        
        coins.forEachAlive(checkOut, null);
        
    }
    
    game.physics.collide(coins, player, collectCoin, null, this);
    
}