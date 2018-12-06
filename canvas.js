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
var sleep1 = [];
var sleep2 = [];
var sleep3 = [];

var imgSource = ["./turtle.png", "./turtleGoingToShell1.png", "./turtleGoingToShell2.png", "./turtleGoingToShell3.png",
"./turtleGoingToShell4.png", "./turtleGoingToShell5.png", "./turtleGoingToShell6.png", "./turtleGoingToShell7.png",
 "./turtleGoingToShell8.png", "./turtleGoingToShell9.png", "./turtleInShell.png", "./turtleSleep.png", "./turtleLaser.png"];

var img = new Array(imgSource.length);
var loadcount = 0;
loadtotal = imgSource.length;

function loadImages() {
    for (var i=0; i<imgSource.length; i++) {
        var image = new Image();
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                draw(xPos, yPos, currentRotation, 0, false, false, false);
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
    sleep1 = [];
    sleep2 = [];
    sleep3 = [];

    goingIntoShell = !goingIntoShell;

    if (currentImageIndex == 11) {
        draw(xPos, yPos, currentRotation, 0);
        currentImageIndex = 0;
    }

    if (goingIntoShell) {
        for (var i = currentImageIndex; i < 11; i++) {
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i);
                rotate.push(currentRotation);
                storeCoordinate(xPos, yPos, coords);
            }
        }
    }else{
        for (var i = currentImageIndex; i >= 0; i--) {
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i);
                rotate.push(currentRotation);
                storeCoordinate(xPos, yPos, coords);
            }
        }
    }

    for (var i = 0; i < coords.length; i++) {
        sleep1.push(false);
        sleep2.push(false);
        sleep3.push(false);
    }

    nextFrame(0);
}

function clickOnCanvas(){
    mouse.x = event.x - 1/2*imgWidth;
    mouse.y = event.y- 1/2*imgHeight;

    coords = [];
    rotate = [];
    imageIndex = [];
    sleep1 = [];
    sleep2 = [];
    sleep3 = [];

    if (currentImageIndex == 11) {
        draw(xPos, yPos, currentRotation, 0);
        currentImageIndex = 0;
    }

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

    for (var i = 0; i < coords.length; i++) {
        sleep1.push(false);
        sleep2.push(false);
        sleep3.push(false);
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
    sleep1 = [];
    sleep2 = [];
    sleep3 = [];

    draw(xPos, yPos, currentRotation, 0);
}

function btnDance(){
    coords = [];
    rotate = [];
    imageIndex = [];
    sleep1 = [];
    sleep2 = [];
    sleep3 = [];

    if (currentImageIndex == 11) {
        draw(xPos, yPos, currentRotation, 0);
        currentImageIndex = 0;
    }

    var division = 50;

    if (currentImageIndex != 0) {
        goingIntoShell = false;
        for (var i = currentImageIndex; i >= 0; i--) {
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

    for (var i = 0; i < coords.length; i++) {
        sleep1.push(false);
        sleep2.push(false);
        sleep3.push(false);
    }

    nextFrame(0);
}

function btnSleep(){
    coords = [];
    rotate = [];
    imageIndex = [];
    sleep1 = []
    sleep2 = []
    sleep3 = []

    if (currentImageIndex == 11) {
        imageIndex.push(0);
        rotate.push(currentRotation);
        storeCoordinate(xPos, yPos, coords);
    }else{
        if (currentImageIndex != 0) {
            goingIntoShell = false;
            for (var i = currentImageIndex; i >= 0; i--) {
                for (var t = 0; t < 5; t++) {
                    imageIndex.push(i);
                    rotate.push(currentRotation);
                    storeCoordinate(xPos, yPos, coords);
                    sleep1.push(false);
                    sleep2.push(false);
                    sleep3.push(false);
                }
            }
        }

        for (var i = 0; i < 160; i++) {
            imageIndex.push(11);
            rotate.push(currentRotation);
            storeCoordinate(xPos, yPos, coords);
            if (i < 40) {

                sleep1.push(false);
                sleep2.push(false);
                sleep3.push(false);
            }else if (i < 80) {
                sleep1.push(true);
                sleep2.push(false);
                sleep3.push(false);
            }else if (i < 120) {
                sleep1.push(true);
                sleep2.push(true);
                sleep3.push(false);
            }else if (i < 160) {
                sleep1.push(true);
                sleep2.push(true);
                sleep3.push(true);
            }
        }
    }

    nextFrame(0);
}

function btnWalk(){

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

function draw(x, y, rotation, imgIndex, sleep_1, sleep_2, sleep_3){
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(x + imgWidth/2, y + imgHeight/2); // change origin
    context.rotate(rotation);
    if (sleep_1) {
        context.font = "25px Arial";
        context.fillText("Z",-75,-100);
    }

    if (sleep_2) {
        context.font = "50px Arial";
        context.fillText("Z",-105,-140);
    }

    if (sleep_3) {
        context.font = "75px Arial";
        context.fillText("Z",-150,-200);
    }
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

    draw(coords[i].x, coords[i].y, rotate[i], imageIndex[i], sleep1[i], sleep2[i], sleep3[i]);
    requestId = requestAnimationFrame(function() {
        nextFrame(i);
    });

    i++;
    if (i == coords.length) {
        stop();
    }
}

loadImages();
