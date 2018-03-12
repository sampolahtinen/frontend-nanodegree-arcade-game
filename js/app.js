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
const heartArray =  document.querySelectorAll('#lives li');

let randomInt = Math.floor(Math.random() * Math.floor(3)); //used for determining random sprite row

//Global supporting functions
//Function that changes the speed of a bug
function speed() {
    let minSpeed = Math.ceil(100);
    let maxSpeed = Math.floor(300);
    let randomSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
        return randomSpeed;
    }

function reset() {
    player.x = 202;
    player.y = 400;
    }
    
function isTop() {
    if(player.y == topBoundary) {
        return true;
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
// Class declaration for Player, Enemy and Heart
class Entity {
    constructor(x,y,sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player extends Entity {
    constructor(x,y,sprite) {
        super(x,y,sprite);
        this.lives = 3;
        this.score = 0;
        this.heartSolid = '<i class="fa fa-heart fa-2x"></i>';
        this.heartEmpty = '<i class="far fa-heart fa-2x"></i>';
    }
    update() {
        scorePanel.innerHTML = `Score: ${this.score}`;
    }
    removeLife() {
        this.lives--;
        let livesElement = document.querySelector('#lives');
        for(let i = 0; i < (3-this.lives); i++ ){
            heartArray[i].innerHTML = this.heartEmpty;
        }
    }

    addLife() {
        if (this.lives === 3) {
            this.score += 10;
            return false;
        }
        if (this.lives === 2 ) {
            heartArray[0].innerHTML = this.heartSolid;
        }
        if (this.lives === 1 ) {
            heartArray[1].innerHTML = this.heartSolid;
        }
        this.lives++; 
    }

    handleInput(keypress) {
        if(this.y === topBoundary) return;
        switch (keypress) {
            case "left":
                if (this.x === leftBoundary) break;
                this.x -= 101;
                break;
            case "up":
                if (this.y === topBoundary) break;
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
        if(this.y === topBoundary) {
            this.score += 10;
            setTimeout( () => {
                this.x = 202;
                this.y = 400;
            },250);
        }
    }
    youWon() {
        if(this.score === 100) {
                this.handleInput = ()=>{};
                hearts.displayHeart = false;
                return true;
        }
             else {
                return false;
            }
        }
    gameOver() {
        if(this.lives === 0) {
            this.handleInput = ()=>{};
            hearts.displayHeart = false;
            return true;
        } else {
            return false;
        }
    }
}

// Enemies our player must avoid
class Enemy extends Entity {
    constructor(x,y,sprite,speed) {
        super(x,y,sprite);
        this.speed = speed;
    }
    update(dt) {
        if(this.x >=  rightBoundary) {
            this.x = 0;
            this.speed = speed();
        } else {
            this.x += Math.round(this.speed * dt);
        }
    }
}

//Lives class
class Heart extends Entity {
    constructor(x,y,sprite) {
        super(x,y,sprite);
        this.displayHeart = false; //variable for displaying a Heart, if true it is displayed, if false its not
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

// Instantiate objects

//Player
let player = new Player(202,400,'images/char-boy.png');

//Enemies
const allEnemies = [];
const enemySprite = 'images/enemy-bug.png';
// Place all enemy objects in an array called allEnemies
(function numberOfEnemies (number) {
    let i=0;
    do {
        if(allEnemies.length === number - 1) {
            allEnemies.push(new Enemy(100,234 - (randomInt * 83),enemySprite, speed())); //places the number-1 sprite on random row
        }else {
        allEnemies.push(new Enemy(0, 234 - ( i * 83 ), enemySprite , speed())); //places the number amount of sprites to first 3 rows
        }
        i++;
    }
    while (allEnemies.length < number);
})(4);

//Heart
const hearts = new Heart(randomPlacement()[0],randomPlacement()[1],'images/Heart.png');

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
                hearts.x = 0;
                hearts.y = 0;
                hearts.displayHeart =  false;
                player.addLife();
                return true;
    }
}
    return false;
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

function renderLives() {
    let livesDom = document.querySelector('#lives');
        for(let i = 0; i < (3-player.lives); i++ ){
            heartArray[i].innerHTML = "<i class='far fa-heart fa-2x'></i>";
        }
}

function resetGame() {
    player = new Player(202,400,'images/char-boy.png');
    hearts.displayOrNot();
    for (let i  = 0; i<player.lives; i++){
        heartArray[i].innerHTML = player.heartSolid;
    }
    allEnemies.forEach(enemy => {
        enemy.x = 0;
    });
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