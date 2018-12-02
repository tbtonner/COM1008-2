//Reference from the HTML page
var canvas = document.getElementById("canvas");

//Set drawing surface of canvas  to same size as the canvas
canvas.width = window.innerWidth;
canvas.height = 600;

//Getting reference to the 2D drawing context
var context = canvas.getContext("2d");

//Setting the mouse object
var mouse = {
    x: undefined,
    y: undefined
}

//Setting image height and width
var imgWidth = 169;
var imgHeight = 237;

//Request to stop ID
var requestId;

//Setting initial position of the turtle
var xPos = (1/2 * canvas.width) - 1/2*imgWidth;
var yPos = (1/2 * canvas.height) - 1/2*imgHeight;

//Array for all coordinates
var coords = [];

//Event listener when mouse moves
window.addEventListener("click", function(event){
    coords = [];
    mouse.x = event.x - 1/2*imgWidth;
    mouse.y = event.y- 1/2*imgHeight;

    //Variables of the line between current position and mouse click
    var m = (yPos-mouse.y)/(xPos-mouse.x);
    var c = yPos-m*xPos;

    var speed = 3;

    if (Math.abs(yPos-mouse.y)>Math.abs(xPos-mouse.x)) {
        if (mouse.y > yPos) {
            for (var yCurrent = yPos; yCurrent < mouse.y; yCurrent=yCurrent+speed) {
                var xCurrent = (yCurrent - c)/m;
                storeCoordinate(xCurrent, yCurrent, coords);
            }
        }else{
            for (var yCurrent = yPos; yCurrent > mouse.y; yCurrent=yCurrent-speed) {
                var xCurrent = (yCurrent - c)/m;
                storeCoordinate(xCurrent, yCurrent, coords);
            }
        }
    }else{
        if (mouse.x > xPos) {
            for (var xCurrent = xPos; xCurrent < mouse.x; xCurrent=xCurrent+speed) {
                var yCurrent = m*xCurrent + c;
                storeCoordinate(xCurrent, yCurrent, coords);
            }
        }else{
            for (var xCurrent = xPos; xCurrent > mouse.x; xCurrent=xCurrent-speed) {
                var yCurrent = m*xCurrent + c;
                storeCoordinate(xCurrent, yCurrent, coords);
            }
        }
    }

    nextFrame(0);

});

//Event listener when window size is changed
window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = 600;

    draw(xPos, yPos);
});

function storeCoordinate(xVal, yVal, array) {
    array.push({
        x: xVal,
        y: yVal
    });
}

function stop() {
    if (requestId){
        cancelAnimationFrame(requestId);
    }
}

var img = new Image();

function translate(x, y){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.drawImage(img, x, y);
    context.restore();
}

function draw(x, y){
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    img.onload = function() {
        context.drawImage(img, x, y);
    }
    img.src = "./turtle1.png";
}

function nextFrame(i) {
    xPos = coords[i].x
    yPos = coords[i].y;
    translate(coords[i].x, coords[i].y);
    requestId = requestAnimationFrame(function() {
        nextFrame(i);
    });

    i++;
    if (i == coords.length) {
        stop();
    }
}

draw(xPos, yPos);
