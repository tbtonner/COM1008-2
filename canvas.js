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
var currentImageIndex = 0;

var goingIntoShell = false;

//Array for all coordinates
var coords = [];
var rotate = [];

var imgSource = ["./turtle.png", "./turtleGoingToShell1.png", "./turtleGoingToShell2.png", "./turtleGoingToShell3.png",
"./turtleGoingToShell4.png", "./turtleGoingToShell5.png", "./turtleGoingToShell6.png", "./turtleGoingToShell7.png",
 "./turtleGoingToShell8.png", "./turtleGoingToShell9.png", "./turtleInShell.png"];

var img = new Array(imgSource.length);
var loadcount = 0;
loadtotal = imgSource.length;

function loadImages() {
    for (var i=0; i<imgSource.length; i++) {
        var image = new Image();
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                draw(xPos, yPos, currentRotation, 0);
            }
        };

        image.src = imgSource[i];
        img[i] = image;
    }
}

//Event listener when mouse moves
window.addEventListener("click", function(event){
    var xMouse = event.x - 1/2*imgWidth;
    var yMouse = event.y- 1/2*imgHeight;

    if (Math.abs(xMouse - xPos) < 1/2*imgWidth &&  Math.abs(yMouse - yPos) < 1/2*imgHeight) {
        clickOnTurtle();
    }else if (yMouse <= 482) {
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

function clickOnTurtle(){
    mouse.x = event.x - 1/2*imgWidth;
    mouse.y = event.y- 1/2*imgHeight;

    coords = [];
    rotate = [];
    imageIndex = [];

    goingIntoShell = !goingIntoShell;

    if (goingIntoShell) {
        for (var i = currentImageIndex; i < img.length; i++) {
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i);
                rotate.push(currentRotation);
                storeCoordinate(xPos, yPos, coords);
            }
        }
    }else{
        for (var i = currentImageIndex; i > 0; i--) {
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i);
                rotate.push(currentRotation);
                storeCoordinate(xPos, yPos, coords);
            }
        }
    }

    nextFrame(0);
}

function clickOnCanvas(){
    mouse.x = event.x - 1/2*imgWidth;
    mouse.y = event.y- 1/2*imgHeight;

    coords = [];
    rotate = [];
    imageIndex = [];

    if (currentImageIndex != 0) {
        goingIntoShell = false;
        for (var i = currentImageIndex; i > 0; i--) {
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i);
                rotate.push(currentRotation);
                storeCoordinate(xPos, yPos, coords);
            }
        }
    }

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

    for (var i = imageIndex.length; i < coords.length; i++) {
        imageIndex.push(0);
    }

    nextFrame(0);

}

function btnReset(){
    xPos = (1/2 * canvas.width) - 1/2*imgWidth;
    yPos = (1/2 * canvas.height) - 1/2*imgHeight;
    currentRotation = 0;
    currentImageIndex = 0;
    goingIntoShell = false;

    coords = [];
    rotate = [];
    imageIndex = [];

    draw(xPos, yPos, currentRotation, 0);
}

function btnDance(){
    coords = [];
    rotate = [];
    imageIndex = [];

    var division = 50;

    if (currentImageIndex != 0) {
        goingIntoShell = false;
        for (var i = currentImageIndex; i > 0; i--) {
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i);
                rotate.push(currentRotation);
                storeCoordinate(xPos, yPos, coords);
            }
        }
    }

    var clockwise = false;

    for (var i = 0; i < 180; i++) {
        if (modulo((currentRotation + i*(Math.PI/180)), (Math.PI*2)) <= 0) {
            if (modulo((currentRotation + (i+1)*(Math.PI/180)), (Math.PI*2)) >= 0) {
                clockwise = true;
            }
        }
    }


    if (clockwise == true) {
        var diffAngle = modulo((0 - currentRotation), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation + i*diffAngle/division), (Math.PI*2)));
            storeCoordinate(xPos, yPos, coords);
            imageIndex.push(0);
        }
    }else {
        var diffAngle = modulo((currentRotation - 0), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation - i*diffAngle/division), (Math.PI*2)));
            storeCoordinate(xPos, yPos, coords);
            imageIndex.push(0);
        }
    }

    //Clockwise fast circle roatation
    for (var i = 0; i <= 60; i++) {
        rotate.push(modulo((i*(Math.PI/180))*6, (Math.PI*2)));
        storeCoordinate(xPos, yPos, coords);
        imageIndex.push(0);
    }

    //Anti-clockwise fast circle roatation
    for (var i = 0; i <= 60; i++) {
        rotate.push(modulo((-i*(Math.PI/180))*6, (Math.PI*2)));
        storeCoordinate(xPos, yPos, coords);
        imageIndex.push(0);
    }

    var dis = 10;
    var danceSpeed = 4;

    //x
    for (var i = 0; i < dis; i++) {
        rotate.push(0);
        storeCoordinate(xPos + i*danceSpeed, yPos, coords);
        imageIndex.push(0);
    }
    for (var i = dis; i > -dis; i--) {
        rotate.push(0);
        storeCoordinate(xPos + i*danceSpeed, yPos, coords);
        imageIndex.push(0);
    }
    for (var i = -dis; i < 0; i++) {
        rotate.push(0);
        storeCoordinate(xPos + i*danceSpeed, yPos, coords);
        imageIndex.push(0);
    }

    //y
    for (var i = 0; i < dis; i++) {
        rotate.push(0);
        storeCoordinate(xPos, yPos + i*danceSpeed, coords);
        imageIndex.push(0);
    }
    for (var i = dis; i > -dis; i--) {
        rotate.push(0);
        storeCoordinate(xPos, yPos + i*danceSpeed, coords);
        imageIndex.push(0);
    }
    for (var i = -dis; i < 0; i++) {
        rotate.push(0);
        storeCoordinate(xPos, yPos + i*danceSpeed, coords);
        imageIndex.push(0);
    }

    //Clockwise fast circle roatation
    for (var i = 0; i <= 60; i++) {
        rotate.push(modulo((i*(Math.PI/180))*6, (Math.PI*2)));
        storeCoordinate(xPos, yPos, coords);
        imageIndex.push(0);
    }

    nextFrame(0);
}

function btnSleep(){

}

function btnColour(){

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

function draw(x, y, rotation, imgIndex){
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(x + imgWidth/2, y + imgHeight/2); // change origin
    context.rotate(rotation);
    context.drawImage(img[imgIndex],-imgWidth/2,-imgHeight/2);
    context.restore();

}

function nextFrame(i) {
    if (coords.length == 0){
        return;
    }

    xPos = coords[i].x;
    yPos = coords[i].y;
    currentRotation = rotate[i];
    currentImageIndex = imageIndex[i];

    draw(coords[i].x, coords[i].y, rotate[i], imageIndex[i]);
    requestId = requestAnimationFrame(function() {
        nextFrame(i);
    });

    i++;
    if (i == coords.length) {
        stop();
    }
}

loadImages();
