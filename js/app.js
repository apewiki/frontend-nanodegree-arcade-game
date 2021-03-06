const PLAYER_START_X=101*2;
const PLAYER_START_Y=83*4; 
const ROWS = 6;
const COLS =5;
const SLOW_SPEED=1;
const HIGH_SPEED=5;
const BLOCK_HEIGHT=83;
const BLOCK_WIDTH=101;
const Y_OFFSET = -20;

const COLLISION_TOLERANCE=80;
const GEM_TOLERANCE=80;

//Utility function to obtain a random integer between a and b
function randomize(a, b) {
    return  a+Math.floor(Math.random()*(b-a));
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

Enemy.prototype = {
    //Reset the position and speed of an enemy when it goes out of bound
    reset : function() {
        this.x=0;
        this.y=randomize(1,4)*BLOCK_HEIGHT+Y_OFFSET;
        this.speed=randomize(SLOW_SPEED,HIGH_SPEED)*83;
    },

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
    update : function(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers
        this.x += dt * this.speed;
        if (this.x >  COLS*BLOCK_WIDTH|| this.x <1){
            this.reset();
        }
    },

// Draw the enemy on the screen, required method for game
    render:function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite='images/char-boy.png'
    this.reset();
};

Player.prototype = {
    //Reset the position of the player to starting point
    resetPos : function() {
        this.x=PLAYER_START_X;
        this.y=PLAYER_START_Y;
    },

    //Reset the player object, used when a new game is started
    reset : function() {
        this.resetPos();
        this.lives=3;
        this.score=0;
    },


    //Check for collision range
    inRange : function(x, y, tolerance) {
        return (Math.abs(x - this.x)< tolerance/2 && Math.abs(y - this.y) < tolerance/2);

    },

    //Check if the player collide with an enemy
    checkCollision : function() {      
        allEnemies.forEach(function(enemy){
            if (this.inRange(enemy.x, enemy.y, COLLISION_TOLERANCE)) {
                this.lives--;
                document.getElementById("game_lives").innerHTML="Lives: "+this.lives;  
                //console.log("collision!");
                //console.log(this.lives, this.x, this.y);
                if (this.lives) {
                    this.resetPos();
                } else {
                    this.reset(); 
                    resetGame();
                }
            }
        }.bind(this));
    },

    //Check if player is out of bound. Reset its position if out of bound
    checkBounds : function() {
        if (this.x>BLOCK_WIDTH*(COLS-1) || this.x<0 || this.y<BLOCK_HEIGHT + Y_OFFSET || this.y>BLOCK_HEIGHT*(ROWS-1)) {
            //console.log("out of bound");
            //console.log(this.x, this.y)
            this.resetPos();
        }
    },

    //Update player status: collision, lives, treasures collected 
    update:function() {
        if (game_on) {
            this.checkBounds();
            this.checkCollision();
            this.checkTreasure();
        }
    },

    //Check if player successfully collects a gem
    checkTreasure : function() {
        if (this.lives && this.inRange(gem.x, gem.y, GEM_TOLERANCE)) {
            this.score++;
            document.getElementById("game_score").innerHTML = "Score: "+this.score;
            //console.log("Got gem");
            //console.log(gem.x, gem.y, this.x, this.y)
            gem.reset();
        }
    },

    render : function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    handleInput : function(e) {
        if (e == 'left'){
            this.x-=BLOCK_WIDTH;
        }
        if (e == 'right'){
            this.x+=BLOCK_WIDTH;
        }
        if (e == 'up'){
            this.y-=BLOCK_HEIGHT;
        }
        if (e == 'down'){
            this.y+=BLOCK_HEIGHT;
        }
    }
};


//Gem object
var Gem = function() {
    this.sprite = "images/BlueGem.png"
    this.reset();
};

Gem.prototype = {
    reset : function() {
        this.x = randomize(1,4)*BLOCK_WIDTH;
        this.y = randomize(1,3)*BLOCK_HEIGHT;
    },

    render : function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game_on = false;

var allEnemies = [];

{
    for (var j=0; j<3; j++){
    var en=new Enemy();
    allEnemies.push(en);
    }
}

var gem = new Gem();

//global.allEnemies=allEnemies;
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (game_on) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

//If player's lives are exhausted, the game is over, reset the game
function resetGame() {
    game_on = false;

    var end_game_element=document.getElementById("end_game");
    end_game_element.style.display=null;
    end_game_element.className="game-over-show";
    var start_btn_element=document.getElementById("start_btn_div");
    start_btn_element.style.display=null;
    start_btn_element.style.display="start";
    var start_btn=document.getElementById("start_btn");
    
    start_btn.innerHTML="Start Over";
}

//Click the start button to start the game
start_btn.onclick=function() {
    start_btn_div.style.display='none';
    end_game.style.display='none';
    game_score.innerHTML='Score: 0';
    game_lives.innerHTML="Lives: 3";
    game_on=true;
}