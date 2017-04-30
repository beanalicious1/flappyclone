/**
 * Created by i57698 on 4/5/17.
 */
/*
Steps for creating game:
1. Create canvas
2. Sprite sheet
    -reference to image
    -definition of sprite areas
    -draw method to context
    -draw sprite set x,y placement
    -first draw (renderingContext, x, y)
        -test pixel at 2x size to make sure scaling is good for high rez phones
    -

 */

var currentState,
    renderingContext,
    canvas,
    width,
    ogroup,
    height,
    frames = 0,
    theHero;

function OctoGroup() { //setting up enemies in the game
    this.collection = [];

    this.reset = function () { //removes all enemies
        this.collection = [];
    }

    this.add = function () { //adds enemies
        this.collection.push(new OctoRok());
    }

    this.update = function () {
        if (frames % 100 === 0) { //this makes it add an enemy every 100 frames
            this.add();
        }

        for(var i = 0, len = this.collection.length; i < len; i++) {
            var octoRok = this.collection[i];

            if (i === 0) {
                octoRok.detectCollision();
            }

            octoRok.x -= 2; //travelling -x
            if (octoRok.x < -octoRok.width) {
                this.collection.splice(i, 1); //this will remove the enemy
                i--;
                len--;
            }
        }
    }
    
    this.draw = function () {
        for (var i = 0, len = this.collection.length; i < len; i++) {
            
            var octoRok = this.collection[i];
            octoRok.draw();
        }
    }
}

function OctoRok () {
    this.x = 400;
    this.y = 340;
    this.width = 45;
    this.height = 55;
    
    this.detectCollision = function () {
        if (this.x === (theHero.x + theHero.width)) {
            console.log("you're dead");
            currentState = states.score;
            document.getElementById("resetbtn").style.display = "block";
        }

        this.draw = function () {
            octoRokSprite.draw(renderingContext, this.x, this.y);
        }
    }
}


var states = {
    splash: 0,
    game: 1,
    score: 2
};

function Hero() {
    this.x = 120; //setting where character is on screen
    this.y = 180;
    this.width = 45;
    this.height = 55;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1]; //calling link's animation spritesheet array
    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this.jumpHeight = 4.6;
    this.jumpCount = 2;

    this.jump = function () {
        if (this.jumpCount > 0) {
            this.velocity = -this.jumpHeight;
            this.jumpCount --;
        }

        //this.velocity = -this.jumpHeight; this breaks double jump for some reason
    };

    this.update = function() {
        var h = currentState === states.splash ? 10 : 5; //ternary operator, basically means if currentstate is states.splash, set h to 10. If not, set it to 5. This is doubling the speed of the animation if splash is true
        this.frame += frames % h === 0 ? 1 : 0; //these slow down the frame draw rate so the movement doesn't happen every millisecond. frames is the global one, we are slowing it down for the character
        this.frame %= this.animation.length;

        if (currentState === states.splash) {
            this.updateIdleHero();
        }
        else {
            this.updatePlayingHero();
        }



    };
        this.updateIdleHero = function () {
        //this.y = 300;
    };


        this.updatePlayingHero = function () { //This is where you set gravity
            this.velocity += this.gravity;
            this.y += this.velocity;

            if (this.y >= 180) {
                this.y = 180;//the -10 accounts for empty spaces beneath the sprite. this checks to see if the character has hit the ground and they stay there
                this.jumpCount = 2;
                this.velocity = this.jumpHeight;
            }



        };
    this.draw = function (renderingContext) {
        renderingContext.save(); //takes object and resets it's context, then draws again. Stops it from being weird with rotation, etc
        renderingContext.translate(this.x, this.y); //translate is a keyword
        renderingContext.rotate(this.rotation);

        var h = this.animation[this.frame]; //this is what changes the frame for animation
        link[h].draw(renderingContext, 20, this.y);
        // console.log("puppies");
        //pulls in link's array, chooses where to draw it on the canvas
        renderingContext.restore();
    }


}



function main() { //check window size and set it
    windowSetup();
    canvasSetup();
    currentState = states.splash;

    document.body.appendChild(canvas);
    loadGraphics(); //actually draw graphics
    ogroup = new OctoGroup();
    theHero = new Hero(); //declared above as a public class
}

function resetgame() {
    ogroup.reset();
    currentState = states.splash;
}

function windowSetup() {
    var screenWidth = window.innerWidth; //find width of the window with this jquery
    // console.log(width);
    if(screenWidth < 500){
        width = 320;
        height = 430;
    }
    else {
        width = 400;
        height = 430;
        inputEvent = "mousedown";
    }

    document.addEventListener("mousedown", onpress);
}

function onpress(evt){ //this is for clicking the button and having an action (jump, etc) happens

    switch (currentState) {
        case states.splash:
            theHero.jump();
            currentState = states.game;
            break;
        case states.game:
            theHero.jump();
            break;
        }

}

function canvasSetup() {
    canvas = document.createElement('canvas');
    canvas.style.border = '5px solid black';
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext('2d');
}

function loadGraphics() {
    var img = new Image();
    img.src = "linkSheet.png";
    img.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = "#3db0dd";
        renderingContext.fillRect(0, 0, width, height);

        // link.draw(renderingContext, 100, 100);
        //ganon.draw(renderingContext, 150, 100);
        gameLoop();
    };

}

function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update() { //game ticker, allows the clock to "count up"
    frames++; //counter
    if (currentState = states.game) {
        ogroup.update();
    }
    theHero.update(); //updates character after input
    //console.log(frames);
}

function render() { //draw everything
    renderingContext.fillRect(0, 0, width, height);
    backgroundSprite.draw(renderingContext, 0, 200);
    //octoRokSprite.draw(renderingContext, 220, 340);
    ogroup.draw(renderingContext);
    theHero.draw(renderingContext);
}