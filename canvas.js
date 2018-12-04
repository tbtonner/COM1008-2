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
var currentRotation = 0;

//Array for all coordinates
var coords = [];
var rotate = [];

//Event listener when mouse moves
window.addEventListener("click", function(event){
    if (event.y- 1/2*imgHeight <= 482) {
        clickOnCanvas();
    }
});

var maxRotate = 0;

//Event listener when window size is changed
window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = 600;

    draw(xPos, yPos);
});

function clickOnCanvas(){
    mouse.x = event.x - 1/2*imgWidth;
    mouse.y = event.y- 1/2*imgHeight;

    coords = [];
    rotate = [];

    //Variables of the line between current position and mouse click
    var m = (yPos-mouse.y)/(xPos-mouse.x);
    var c = yPos-m*xPos;

    var division = 50;

    if (mouse.x > xPos) {
        if (mouse.y < yPos) {
            var opp = Math.abs(mouse.x - xPos);
            var adj = Math.abs(mouse.y - yPos);
            maxRotate = (Math.atan(opp/adj));
        }else{
            var opp = Math.abs(mouse.y - yPos);
            var adj = Math.abs(mouse.x - xPos);

            maxRotate = (Math.atan(opp/adj)) + (Math.PI/2);
        }
    }else {
        if (mouse.y > yPos) {
            var opp = Math.abs(mouse.x - xPos);
            var adj = Math.abs(mouse.y - yPos);

            maxRotate = (Math.atan(opp/adj)) + (Math.PI);
        }else{
            var opp = Math.abs(mouse.y - yPos);
            var adj = Math.abs(mouse.x - xPos);

            maxRotate = (Math.atan(opp/adj)) + (3*Math.PI/2);
        }
    }

    var clockwise = false;

    for (var i = 0; i < 180; i++) {
        if (modulo((currentRotation + i*(Math.PI/180)), (Math.PI*2)) <= maxRotate) {
            if (modulo((currentRotation + (i+1)*(Math.PI/180)), (Math.PI*2)) >= maxRotate) {
                clockwise = true;
            }
        }
    }


    if (clockwise == true) {
        var diffAngle = modulo((maxRotate - currentRotation), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation + i*diffAngle/division), (Math.PI*2)));
            storeCoordinate(xPos, yPos, coords);
        }
    }else {
        var diffAngle = modulo((currentRotation - maxRotate), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation - i*diffAngle/division), (Math.PI*2)));
            storeCoordinate(xPos, yPos, coords);
        }
    }

    var speed = 3;

    if (Math.abs(yPos-mouse.y)>Math.abs(xPos-mouse.x)) {
        if (mouse.y > yPos) {
            for (var yCurrent = yPos; yCurrent < mouse.y; yCurrent=yCurrent+speed) {
                var xCurrent = (yCurrent - c)/m;
                storeCoordinate(xCurrent, yCurrent, coords);
                rotate.push(maxRotate);
            }
        }else{
            for (var yCurrent = yPos; yCurrent > mouse.y; yCurrent=yCurrent-speed) {
                var xCurrent = (yCurrent - c)/m;
                storeCoordinate(xCurrent, yCurrent, coords);
                rotate.push(maxRotate);
            }
        }
    }else{
        if (mouse.x > xPos) {
            for (var xCurrent = xPos; xCurrent < mouse.x; xCurrent=xCurrent+speed) {
                var yCurrent = m*xCurrent + c;
                storeCoordinate(xCurrent, yCurrent, coords);
                rotate.push(maxRotate);
            }
        }else{
            for (var xCurrent = xPos; xCurrent > mouse.x; xCurrent=xCurrent-speed) {
                var yCurrent = m*xCurrent + c;
                storeCoordinate(xCurrent, yCurrent, coords);
                rotate.push(maxRotate);
            }
        }
    }

    nextFrame(0);

}

function btnReset(){
    xPos = (1/2 * canvas.width) - 1/2*imgWidth;
    yPos = (1/2 * canvas.height) - 1/2*imgHeight;
    currentRotation = 0;

    coords = [];
    rotate = [];

    nextFrame(0);
    draw(xPos, yPos);
}

function btnDance(){
    console.log("Dance");
}

function btnSleep(){
    console.log("Sleep");
}

function btnColour(){
    console.log("Change Colour");
}

function modulo(n, m) {
    return ((n % m) + m) % m;
}

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

function translate(x, y, rotation){
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(x + imgWidth/2, y + imgHeight/2); // change origin
    context.rotate(rotation);
    context.drawImage(img,-imgWidth/2,-imgHeight/2);
    context.restore()

}

function draw(x, y){
    context.clearRect(0, 0, canvas.width, canvas.height);
    img.onload = function() {
        context.drawImage(img, x, y);
    }
    img.src = "./turtle1.png";
}

function nextFrame(i) {
    if (coords.length == 0){
        return;
    }
    xPos = coords[i].x
    yPos = coords[i].y;
    currentRotation = rotate[i];
    translate(coords[i].x, coords[i].y, rotate[i]);
    requestId = requestAnimationFrame(function() {
        nextFrame(i);
    });

    i++;
    if (i == coords.length) {
        stop();
    }
}

draw(xPos, yPos);
