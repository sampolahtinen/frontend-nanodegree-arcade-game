// Canvas boundaries
const leftBoundary = 0;
const rightBoundary = 404;
const topBoundary = -15;
const bottomBoundary = 400;

// Enemies our player must avoid
var Enemy = function (x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x >=  rightBoundary) {
        this.x = 0;
    } else {
        this.x += Math.round(this.speed * dt);
    }
    speed();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function reset() {
    player.x = 202;
    player.y = 400;
}

function isTop() {
    if(player.y == topBoundary) {
        return true;
    }
}

const heartArray =  document.querySelectorAll('#lives li');

function checkCollisions() {
    for (const enemy of allEnemies) {
        if(player.y == Math.round(enemy.y)) {
            if(Math.abs(player.x - Math.round(enemy.x)) <= 30) {
                reset();
                player.lives -= 1;
                hearts.removeHeart();
            if (player.lives === 0) {
                console.log("GAME OVER!");
            }
            return true;
            }
        }
    }
    //Check if player gets a heart
    if(player.x == Math.round(hearts.x)) {
        if(Math.abs(player.y - Math.round(hearts.y)) <= 30) {
            if(player.lives < 3) {
                hearts.addHeart();
                display =  false;
                    return true;
        }
    }
}
    return false;
}

class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 202;
        this.y = 400;
        this.lives = 3;
    }

    update() {
        if( isTop() ) {  //if player gets water, wait some milliseconds and reset its position
            setTimeout(function(){
                reset();
            },250);
        } 
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(keypress) {
        switch (keypress) {
            case "left":
                if (this.x === leftBoundary) break;
                this.x -= 101;
                break;
            case "up":
                if (isTop() ) {
                    this.y = this.y; // prevents stepping over the topBoundary while setTimeout is running.
                    break;
                }
                this.y -= 83;
                break;
            case "right":
                if (this.x === rightBoundary) break;
                this.x += 101;
                break;
            case "down":
                if (this.y === bottomBoundary) break;
                this.y += 83;
                break;
        }
    }
}

//Lives class
class Heart {
    constructor() {
        this.heartSolid = '<i class="fa fa-heart fa-2x"></i>';
        this.heartEmpty = '<i class="far fa-heart fa-2x"></i>';
        this.sprite = 'images/heart.png' //'/images/Heart.png';
        this.x = randomPlacement()[0];
        this.y = randomPlacement()[1];
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    removeHeart() {
        let livesElement = document.querySelector('#lives');
        for(let i = 0; i < (3-player.lives); i++ ){
            heartArray[i].innerHTML = this.heartEmpty;
        }
        if(player.lives === 0) {
            gameOver();
        }
    }
    addHeart() {
        if (player.lives === 3) {
            return false;
        } 
        for (let i = 2; i >= 0; i--){
            if(heartArray[i].innerHTML === this.heartEmpty) {
                heartArray[i].innerHTML = this.heartSolid;
                break;
            }
        }
        player.lives++;
    }
}

const hearts = new Heart();

function gameOver() {
    alert("GAME OVER");
}

function randomPlacement() {
   let xy = [];
   xy[0] = 101 * Math.floor(Math.random() * Math.floor(5));
   xy[1] = 83 * Math.floor(Math.random() * Math.floor(3));
    if(xy[1]===0) xy[1]=83;
   return xy;
}

function randomInterval() {
    const minTime = Math.ceil(10000);
    const maxTime = Math.floor(20000);
    const interval = Math.floor(Math.random() * (maxTime-minTime))+minTime;
    return interval;
}
let display; //variable for displaying a Heart, if true it is displayed, if false its not
setInterval(function(){
    display = true;
    hearts.x = randomPlacement()[0];
    hearts.y = randomPlacement()[1];
},randomInterval());


function renderLives() {
    let livesDom = document.querySelector('#lives');
        for(let i = 0; i < (3-player.lives); i++ ){
            heartArray[i].innerHTML = "<i class='far fa-heart fa-2x'></i>";
        }
}

const allEnemies = [];
let randomInt = Math.floor(Math.random() * Math.floor(3)); //used for determining random sprite row

function speed() {
    let minSpeed = Math.ceil(150);
    let maxSpeed = Math.floor(400);
    let randomSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
        return randomSpeed;
    }

// Place all enemy objects in an array called allEnemies
(function numberOfEnemies (number) {
    let i=0;
    do {
        if(allEnemies.length === number - 1) {
            allEnemies.push(new Enemy(100,234 - (randomInt * 83), speed())); //places the number-1 sprite on random row
        }else {
        allEnemies.push(new Enemy(0, 234 - ( i * 83 ) , speed())); //places the number amount of sprites to first 3 rows
        }
        i++
    }
    while (allEnemies.length < number);
})(4);

// Now instantiate your objects.
// Place the player object in a variable called player
let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});