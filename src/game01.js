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
    WIN_SCORE = 5,
    PLAYER_CONSTANT = 1,
    COMPUTER_CONSTANT = -1,
    
    p1Score = 0,
    p2Score = 0,
    p1ScoreText,
    p2ScoreText,
    
    startGameText,
    endGameText,
    
    startGame,
    gameRunning = true,
    currFrame = 0,
    paddles;

function create() {
 
    "use strict";
    
    game.stage.backgroundColor = '#63d1f1';
    
    p1ScoreText = game.add.text(75, game.height - 40, 'Score: 0', { font: "30px Arial", fill: "#ffffff" });
    p1ScoreText.anchor.setTo(0.5, 0.5);
    p2ScoreText = game.add.text(game.width - 75, game.height - 40, 'Score: 0', { font: "30px Arial", fill: '#FFFFFF' });
    p2ScoreText.anchor.setTo(0.5, 0.5);
    startGameText = game.add.text(game.world.centerX, game.world.centerY, 'PRESS SPACE TO START', { font: "30px Arial", fill: "#FFFFFF" });
    startGameText.anchor.setTo(0.5, 0.5);
    endGameText = game.add.text(game.world.centerX, game.world.centerY, '', { font: "30px Arial", fill: "#FFFFFF" });
    endGameText.anchor.setTo(0.5, 0.5);
 
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
    
    startGame = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    newBall();
}

function restart() {
    "use strict";
    ball.kill();
}

function gameOver(side) {
    
    "use strict";
    
    if (side === 1) {
        endGameText.content = "You Lose!!";
    } else {
        endGameText.content = "You Win!";
    }
    
    gameRunning = false;
    startGameText.visible = false;
    endGameText.visible = true;
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
    
    startGameText.visible = true;
    
    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);
    ball.body.velocity.x = getVelocity();
    ball.body.velocity.y = getVelocity();
    ball.name = 'ball';
    
    ball.kill();
}

function hitWall(side) {
    
    "use strict";
    
    if (side === -1) {
        p1Score += 1;
        p1ScoreText.content = 'Score: ' + p1Score;
    } else {
        p2Score += 1;
        p2ScoreText.content = 'Score: ' + p2Score;
    }
    
    ball.kill();
    newBall();
    
    if (p1Score === WIN_SCORE || p2Score === WIN_SCORE) {
        gameOver(side);
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
    
    if (startGame.isDown && gameRunning) {
        ball.revive();
        startGameText.visible = false;
    }
    
    game.physics.collide(paddles, ball, collisionHandler, null, paddles);
    
    //move paddle to mouse y pos
    paddle1.y = game.input.y;
    
    //make it move faster the closer the ball is to the paddle
    //var currSpeed = PADDLE_SPEED + ((ball.body.x / game.width) - 0.5); CAN'T MOVE HALF A PIXEL!
    var currPos = ball.body.x / game.width,
        currSpeed = PADDLE_SPEED;
    if (currPos < 0.25) {
        currSpeed = PADDLE_SPEED * 0.5;
    } else if (currPos > 0.75) {
        currSpeed = PADDLE_SPEED * 1.5;
    }
    
    //move computer paddle based on ball's position
    if (Math.abs(paddle2.y - ball.y) > 50) {
        if (paddle2.y > ball.y) {
            paddle2.y -= currSpeed;
        } else {
            paddle2.y += currSpeed;
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