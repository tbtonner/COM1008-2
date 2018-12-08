//Get reference from the HTML page for canvas element
var canvas = document.getElementById("canvas");

//Set drawing surface of canvas to same size as the canvas
canvas.width = window.innerWidth;
canvas.height = 600;

//Getting reference to the 2D drawing context
var context = canvas.getContext("2d");

//--------------------Setting and defining all variables--------------------//

//Setting image height and width of all images (excluding turtleLaser.png)
var imgWidth = 169;
var imgHeight = 237;

//Setting imange differece between turtleLaser and all others to 0 (for now)
var imgDiff = 0;

//Request to stop ID variable
var requestId;

//Setting initial position of the turtle
var xPos = (1/2 * canvas.width) - 1/2*imgWidth;
var yPos = (1/2 * canvas.height) - 1/2*imgHeight;

//Setting current rotation and the starting image index
var currentRotation = 0;
var currentImageIndex = 0;

var goingIntoShell = false; //State to tell whether turtle is going into shell or going out
var walking = 0; //Walking state set to 0

var coords = []; //Array for all coordinates
var rotate = []; //Array for all rotations
var sleep1 = []; //Array for when first z shows
var sleep2 = []; //Array for when second z shows
var sleep3 = []; //Array for when third z shows

//All images used and their sources
var imgSource = ["./turtle.png", "./turtleGoingToShell1.png", "./turtleGoingToShell2.png", "./turtleGoingToShell3.png",
"./turtleGoingToShell4.png", "./turtleGoingToShell5.png", "./turtleGoingToShell6.png", "./turtleGoingToShell7.png",
 "./turtleGoingToShell8.png", "./turtleGoingToShell9.png", "./turtleInShell.png", "./turtleSleep.png", "./turtleLaser.png"];

//Setting img array with the length equal to sources
var img = new Array(imgSource.length);

//Variables for loading all images and keeping track of where it's up to
var loadcount = 0;
loadtotal = imgSource.length;

//Setting initial maxRotate variable to 0
var maxRotate = 0;

//--------------------Event listeners--------------------//

//Event listener when mouse moves
window.addEventListener("click", function(event){
    //Current x and y positions of click
    var xMouse = event.x - 1/2*imgWidth;
    var yMouse = event.y- 1/2*imgHeight;

    if (Math.abs(xMouse - xPos) < 1/2*imgWidth &&  Math.abs(yMouse - yPos) < 1/2*imgHeight) { //If click was on turtle:
        if  (Math.sqrt(Math.pow((yMouse - yPos), 2) + Math.pow((xMouse - xPos), 2)) >= 60){ //If click was not on turtle's shell
            clickOnTurtleHead();
        }else{
            clickOnTurtleBody();
        }
    }else if (yMouse <= 482) { //If mouse click was on canvas and not on turtle:
        walk(xMouse, yMouse);
    }
});

//Event listener when window size is changed
window.addEventListener("resize", function(){
    canvas.width = window.innerWidth; //Change canvas' width
    canvas.height = 600; //Change canvas' height

    btnReset();
});

//--------------------Simple functions--------------------//

function resetArrays(){ //Function that resets all arrays to []
    coords = [];
    rotate = [];
    imageIndex = [];
    sleep1 = [];
    sleep2 = [];
    sleep3 = [];
}

function loadImages() { //Initial function to load all images
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

function modulo(n, m) { //Function to calculate n mod m, avoiding negative numbers that you get when using %
    return ((n % m) + m) % m;
}

function storeCoordinate(xVal, yVal, array) { //Function to store coordinates of the coords array
    array.push({
        x: xVal,
        y: yVal
    });
}

//--------------------Large functions--------------------//

function clickOnTurtleHead(){ //When clicking on turtle's head
    resetArrays();
    walking = 0;

    //Clockwise fast circle roatation
    for (var i = 0; i <= 360/3; i++) {
        rotate.push(modulo((currentRotation+(i*(Math.PI/180))*3), (Math.PI*2)));
        storeCoordinate(xPos, yPos, coords);
        imageIndex.push(12);
    }

    nextFrame(0);

}

function clickOnTurtleBody(){ //When clicking on turtle's body
    resetArrays();
    walking = 0;

    goingIntoShell = !goingIntoShell;

    if (currentImageIndex == 11 || currentImageIndex == 12) {
        draw(xPos, yPos, currentRotation, 0, false, false, false);
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

function walk(toX, toY){ //Function to walk from current position to (toX, toY) coordinates with animation
    resetArrays();

    if (currentImageIndex == 11 || currentImageIndex == 12) {
        draw(xPos, yPos, currentRotation, 0, false, false, false);
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
    if (xPos - toX == 0) {
        var m = 80000;
    }else{
        var m = (yPos-toY)/(xPos-toX);
    }
    var c = yPos-m*xPos;

    var division = 50;

    if (toX > xPos) {
        if (toY < yPos) {
            var opp = Math.abs(toX - xPos);
            var adj = Math.abs(toY - yPos);
            maxRotate = (Math.atan(opp/adj));
        }else{
            var opp = Math.abs(toY - yPos);
            var adj = Math.abs(toX - xPos);

            maxRotate = (Math.atan(opp/adj)) + (Math.PI/2);
        }
    }else {
        if (toY > yPos) {
            var opp = Math.abs(toX - xPos);
            var adj = Math.abs(toY - yPos);

            maxRotate = (Math.atan(opp/adj)) + (Math.PI);
        }else{
            var opp = Math.abs(toY - yPos);
            var adj = Math.abs(toX - xPos);

            maxRotate = (Math.atan(opp/adj)) + (3*Math.PI/2);
        }
    }

    var clockwise = false;
    if (walking != 0 && walking != 1) {
        clockwise = true;
    }else{
        for (var i = 0; i < 180; i++) {
            if (modulo((currentRotation + i*(Math.PI/180)), (Math.PI*2)) <= maxRotate) {
                if (modulo((currentRotation + (i+1)*(Math.PI/180)), (Math.PI*2)) >= maxRotate) {
                    clockwise = true;
                }
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

    if (Math.abs(yPos-toY)>Math.abs(xPos-toX)) {
        if (toY > yPos) {
            for (var yCurrent = yPos; yCurrent < toY; yCurrent=yCurrent+speed) {
                var xCurrent = (yCurrent - c)/m;
                storeCoordinate(xCurrent, yCurrent, coords);
                rotate.push(maxRotate);
            }
        }else{
            for (var yCurrent = yPos; yCurrent > toY; yCurrent=yCurrent-speed) {
                var xCurrent = (yCurrent - c)/m;
                storeCoordinate(xCurrent, yCurrent, coords);
                rotate.push(maxRotate);
            }
        }
    }else{
        if (toX > xPos) {
            for (var xCurrent = xPos; xCurrent < toX; xCurrent=xCurrent+speed) {
                var yCurrent = m*xCurrent + c;
                storeCoordinate(xCurrent, yCurrent, coords);
                rotate.push(maxRotate);
            }
        }else{
            for (var xCurrent = xPos; xCurrent > toX; xCurrent=xCurrent-speed) {
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

function btnReset(){ //Resets entire screen
    xPos = (1/2 * canvas.width) - 1/2*imgWidth;
    yPos = (1/2 * canvas.height) - 1/2*imgHeight;
    currentRotation = 0;
    currentImageIndex = 0;
    goingIntoShell = false;
    walking = 0;
    imgDiff = 0;

    resetArrays();

    draw(xPos, yPos, currentRotation, 0, false, false, false);
}

function btnDance(){ //Makes the turtle dance
    resetArrays();
    walking = 0;

    if (currentImageIndex == 11 || currentImageIndex == 12) {
        draw(xPos, yPos, currentRotation, 0, false, false, false);
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

function btnSleep(){ //Makes the turtle sleep
    resetArrays();
    walking = 0;

    if (currentImageIndex == 11 || currentImageIndex == 12) {
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

function btnWalk(){ //What happens when walk button is pressed
    walking = 1;
    walk(xPos - 100, yPos - 100);
}

function stop() { //Stop the animation frame
    cancelAnimationFrame(requestId);

    if (walking ==1) {
        walking++;
        walk(xPos + 200, yPos);
    }else if (walking ==2) {
        walking++;
        walk(xPos, yPos + 200);
    }else if (walking ==3) {
        walking++;
        walk(xPos - 200, yPos);
    }else if (walking ==4) {
        walk(xPos, yPos - 200);
        walking = 0;
    }
}

function draw(x, y, rotation, imgIndex, sleep_1, sleep_2, sleep_3){ //Draw turtle and other items on screen with given peramters

    if (imgIndex == 12) {
        imgDiff = 215;
    }else {
        imgDiff = 0;
    }

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
    context.drawImage(img[imgIndex],-imgWidth/2,-imgHeight/2-imgDiff);
    context.restore();

}

function nextFrame(i) { //Changing for each animation frame
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

//--------------------Initial Run Code--------------------//
loadImages(); //Loads all images and draws the first initial image on canvas
