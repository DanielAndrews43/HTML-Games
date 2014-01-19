/*global Phaser, preload, create, update, console, newBall*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
function preload() {

    "use strict";
    
    game.load.image('logo', 'bin/logo.png');
    game.load.image('paddle', 'bin/paddle.png');
    game.load.image('ball', 'bin/ball.png');
	
}
 
var logo,
    paddle1,
    paddle2,
    ball,
    PADDLE_SPEED = 3,
    p1Score = 0,
    p2Score = 0,
    WIN_SCORE = 10,
    PLAYER_CONSTANT = 1,
    COMPUTER_CONSTANT = -1,
    currFrame = 0,
    paddles;

function create() {
 
    "use strict";
    
    game.stage.backgroundColor = '#63d1f1';
 
    paddle1 = game.add.sprite(20, game.world.centerY, 'paddle');
    paddle1.anchor.setTo(0.5, 0.5);
    paddle1.body.collideWorldBounds = true;
    paddle1.body.immovable = true;
    paddle1.body.bounce.setTo(1, 1);
    paddle1.body.setSize(20, 100, 0, 0);
    paddle1.name = 'player';
    paddle1.angleMod = 1;
    
    paddle2 = game.add.sprite(game.width - 20, game.world.centerY, 'paddle');
    paddle2.anchor.setTo(0.5, 0.5);
    paddle2.body.collideWorldBounds = true;
    paddle2.body.immovable = true;
    paddle2.body.bounce.setTo(1, 1);
    paddle2.body.setSize(20, 100, 0, 0);
    paddle2.name = 'computer';
    paddle2.angleMod = -1;
    
    paddles = game.add.group();
    paddles.add(paddle1);
    paddles.add(paddle2);
    
    newBall();
    
}

function restart() {
    "use strict";
    ball.kill();
}

function gameWin(side) {
    
    "use strict";
    
    //Print text about win/lose, resest stats, ask to play again
}

function getVelocity() {
    "use strict";
    
    var velo = 1;
    
    if (Math.random() > 0.5) {
        velo *= -1;
    }
    return velo * 300;
}

function newBall() {
    "use strict";
    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);
    ball.body.velocity.x = getVelocity();
    ball.body.velocity.y = getVelocity();
    ball.name = 'ball';
}

function hitWall(side) {
    
    "use strict";
    
    if (side === 0) {
        p1Score += 1;
    } else {
        p2Score += 1;
    }
    
    ball.kill();
    newBall();
    
    if (p1Score === WIN_SCORE || p2Score === WIN_SCORE) {
        gameWin(side);
    }
}

function collisionHandler(ball, paddle) {
    "use strict";
    
    var diff = Math.abs(ball.y - paddle.y);
    if (paddle.y < ball.y) {
        //Bottom half
        ball.body.velocity.y = 10 * diff;
    } else {
        //Top half
        ball.body.velocity.y = -10 * diff;
    }
    
    console.log(paddle.name + ' hit ' + ball.name);
}

function update() {
    "use strict";
    
    game.physics.collide(paddles, ball, collisionHandler, null, paddles);
    
    //move paddle to mouse y pos
    paddle1.y = game.input.y;
    
    //move computer paddle based on ball's position
    //Only moves half of the frames
    if (Math.abs(paddle2.y - ball.y) > 50) {
        if (paddle2.y > ball.y) {
            paddle2.y -= PADDLE_SPEED;
        } else {
            paddle2.y += PADDLE_SPEED;
        }
    }
    currFrame += 1;
    
    //Checks if point is scored
    if (ball.body.x < 10) {
        hitWall(PLAYER_CONSTANT);
    } else if (ball.body.x > game.width - 30) {
        hitWall(COMPUTER_CONSTANT);
    }
}