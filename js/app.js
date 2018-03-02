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

//Speed means moving in x-direction so dx/dt

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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function reset() {
    player.x = 202;
    player.y = 400;
}

function isTop() {
    if(player.y == topBoundary) {
        return true;
    }
}

function checkCollisions() {
    for (const enemy of allEnemies) {
        if(player.y == Math.round(enemy.y)) {
            if(Math.abs(player.x - Math.round(enemy.x)) <= 30) {
            reset();
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

// Lives 
class Heart {
    constructor() {
        this.heartSolid = "<i class='fa fa-heart fa-2x'></i>";
        this.heartEmpty = "<i class='far fa-heart fa-2x'></i>";
        this.state = "<i class='fa fa-heart fa-2x'></i>";
    }
    toggleState() {
        if(this.state === this.heartSolid) {
            this.state = this.heartEmpty;
        } else {
            this.state = this.heartSolid;
        }
    }
}

const heart1 = new Heart();
const heart2 = new Heart();
const heart3 = new Heart();

let ul = document.querySelector('#lives');
let li = document.createElement("li");
$(li).append(heart1.state);
$(ul).append(li);

//How many enemies?
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