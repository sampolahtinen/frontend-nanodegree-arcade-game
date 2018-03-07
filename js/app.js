//Remove default navigation of arrow keys
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// Canvas boundaries
const leftBoundary = 0;
const rightBoundary = 404;
const topBoundary = -15;
const bottomBoundary = 400;

//DOM Elements
const scorePanel = document.querySelector('.score h3');
const playAgainButton = document.querySelector('.btn.btn-info');
playAgainButton.addEventListener('click',resetGame);
// Enemies our player must avoid
var Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

//Function that changes the speed of a bug
function speed() {
    let minSpeed = Math.ceil(100);
    let maxSpeed = Math.floor(300);
    let randomSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
        return randomSpeed;
    }
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    if(this.x >=  rightBoundary) {
        this.x = 0;
        this.speed = speed();
    } else {
        this.x += Math.round(this.speed * dt);
    }
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
            if(Math.abs(player.x - Math.round(enemy.x)) <= 60) {
                reset();
                player.removeLife();
            return true;
            }
        }
    }
    //Check if player gets a heart
    if(player.x == hearts.x) {
        if(Math.abs(player.y - Math.round(hearts.y)) <= 20) {
           // if(player.lives < 3) {
                hearts.x = 0;
                hearts.y = 0;
                hearts.displayHeart =  false;
                player.addLife();
                return true;
        //}
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
        this.score = 0;
        this.heartSolid = '<i class="fa fa-heart fa-2x"></i>';
        this.heartEmpty = '<i class="far fa-heart fa-2x"></i>';
    }
    update() {
        if( isTop() ) {  //if player gets water, wait some milliseconds and reset its position
            setTimeout(function(){
                addScore();
                reset();
            },250);
        }
        
        
        scorePanel.innerHTML = `Score: ${this.score}`;
    }
    removeLife() {
        this.lives--;
        let livesElement = document.querySelector('#lives');
        for(let i = 0; i < (3-player.lives); i++ ){
            heartArray[i].innerHTML = this.heartEmpty;
        }
        if(player.lives === 0) {
            gameOver();
        }
    }

    addLife() {
        if (player.lives === 3) {
            this.score += 10;
            return false;
        }
        if (player.lives === 2 ) {
            heartArray[0].innerHTML = this.heartSolid;
        }
        if (player.lives === 1 ) {
            heartArray[1].innerHTML = this.heartSolid;
        }
        this.lives++; 
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
        this.sprite = 'images/heart.png' //'/images/Heart.png';
        this.x = randomPlacement()[0];
        this.y = randomPlacement()[1];
        this.displayHeart = false; //variable for displaying a Heart, if true it is displayed, if false its not
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    displayOrNot() {
        let displayRandomly = Math.floor(Math.random() * Math.floor(2));
        if (displayRandomly === 1) {
            this.displayHeart = true;
            return true;
        } else {
            this.displayHeart = false;
            return false;
        }
    }
}

setInterval(function(){
    console.log(hearts.displayHeart);
    if ( hearts.displayOrNot() ) {
    hearts.x = randomPlacement()[0];
    hearts.y = randomPlacement()[1];
    } else {
        hearts.displayHeart = false;
    }
},randomInterval());

const hearts = new Heart();

function gameOver() {
    if(player.lives === 0) {
        player.handleInput = ()=>{};
        hearts.displayHeart = false;
        return true;
    } else {
        return false;
    }
}

function youWon() {
    if(player.score === 100) {
            player.handleInput = ()=>{};
            hearts.displayHeart = false;
            return true;
    }
         else {
            return false;
        }
    }
function addScore() { //a function to add score. It traps "this" to player object when calling inside setTimeout
    if(player.y === topBoundary) {
        player.score += 10;
    }
}

function randomPlacement() {
   let xy = [];
   xy[0] = 101 * Math.floor(Math.random() * Math.floor(5));
   xy[1] = 83 * Math.floor(Math.random() * Math.floor(3));
    if(xy[1]===0) xy[1]=83;
   return xy;
}

function randomInterval() { //controls how often hearts appear
    const minTime = Math.ceil(5000);
    const maxTime = Math.floor(10000);
    const interval = Math.floor(Math.random() * (maxTime-minTime))+minTime;
    return interval;
}

function renderLives() {
    let livesDom = document.querySelector('#lives');
        for(let i = 0; i < (3-player.lives); i++ ){
            heartArray[i].innerHTML = "<i class='far fa-heart fa-2x'></i>";
        }
}

const allEnemies = [];
let randomInt = Math.floor(Math.random() * Math.floor(3)); //used for determining random sprite row


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

function resetGame() {
    player = new Player();
    hearts.displayOrNot();
    for (let i  = 0; i<player.lives; i++){
        heartArray[i].innerHTML = player.heartSolid;
    }
    allEnemies.forEach(enemy => {
        enemy.x = 0;
    });
    reset();
}
    

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});