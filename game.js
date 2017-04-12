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
    height,
    frames = 0,
    theHero;


var states = {
    splash: 0,
    game: 1,
    score: 2
};

function Hero() {
    this.x = 140; //setting where character is on screen
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1]; //calling link's animation spritesheet array
    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this.jumpHeight = 4.6;

    this.update = function() {
        var h = currentState === states.splash ? 10 : 5; //ternary operator, basically means if currentstate is states.splash, set h to 10. If not, set it to 5. This is doubling the speed of the animation if splash is true
        this.frame += frames % h === 0 ? 1 : 0;
        this.frame %= this.animation.length;
    };
    
    this.draw = function (renderingContext) {
        renderingContext.save(); //takes object and resets it's context, then draws again. Stops it from being weird with rotation, etc
        renderingContext.translate(this.x, this.y); //translate is a keyword
        renderingContext.rotate(this.rotation);

        var h = this.animation[this.frame]; //this is what changes the frame for animation
        link[h].draw(renderingContext, 140, 100);
        // console.log("puppies");
        //pulls in link's array, chooses where to draw it on the canvas
    }

}

function main() {
    windowSetup();
    canvasSetup();
    currentState = states.splash;

    document.body.appendChild(canvas);
    loadGraphics();
    theHero = new Hero();
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
        renderingContext.fillStyle = "#8BE4DF";
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

function update() {
    frames++;
    theHero.update();
    //console.log(frames);
}

function render() {
    renderingContext.fillRect(0, 0, width, height);
    theHero.draw(renderingContext);
}