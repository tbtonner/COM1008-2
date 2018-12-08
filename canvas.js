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
var imageIndex = []; //Array for all image index's
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
var loadtotal = imgSource.length;

//Setting initial maxRotate variable to 0
var maxRotate = 0;

//--------------------Event listeners--------------------//

//Event listener when mouse moves
window.addEventListener("click", function(event){
    //Current x and y positions of click
    var xMouse = event.x - 1/2*imgWidth;
    var yMouse = event.y- 1/2*imgHeight;

    if (yMouse <= canvas.height - 1/2*imgHeight) {
        if (Math.abs(xMouse - xPos) < 1/2*imgWidth &&  Math.abs(yMouse - yPos) < 1/2*imgHeight) { //If click was on turtle:
            if  (Math.sqrt(Math.pow((yMouse - yPos), 2) + Math.pow((xMouse - xPos), 2)) >= 60){ //If click was not on turtle's shell
                clickOnTurtleHead();
            }else{
                clickOnTurtleBody();
            }
        }else{ //If mouse click was on canvas and not on turtle:
            walking = 0;
            stop();
            walk(xMouse, yMouse);
        }
    }
});

//Event listener when window size is changed
window.addEventListener("resize", function(){
    canvas.width = window.innerWidth; //Change canvas' width
    canvas.height = 600; //Change canvas' height

    btnReset(); //Reset all parts of canvas
});

//--------------------Small functions--------------------//

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
        image.onload = function () { //Loading images
            loadcount++; //Incrementing image count
            if (loadcount == loadtotal) {
                draw(xPos, yPos, currentRotation, 0, false, false, false); //Initial drawing of turtle
            }
        };

        image.src = imgSource[i];
        img[i] = image; //Storing images in an array
    }
}

function modulo(n, m) { //Function to calculate n mod m, avoiding negative numbers that you get when using %
    return ((n % m) + m) % m;
}

function storeCoordinate(xVal, yVal, array) { //Function to store coordinates of the coords array
    array.push({ //Pushing xVal and yVal to array.x and array.y respectivley
        x: xVal,
        y: yVal
    });
}

function stop() { //Stop the animation frame
    cancelAnimationFrame(requestId); //Stop the animation

    //Change walking state if walking button pressed
    if (walking == 1) {
        walking++;
        walk(xPos + 200, yPos);
    }else if (walking == 2) {
        walking++;
        walk(xPos, yPos + 200);
    }else if (walking == 3) {
        walking++;
        walk(xPos - 200, yPos);
    }else if (walking == 4) {
        walk(xPos, yPos - 200);
        walking = 0;
    }
}

//--------------------Button functions--------------------//

function btnReset(){ //Resets entire screen
    //Resetting x and y positions
    xPos = (1/2 * canvas.width) - 1/2*imgWidth;
    yPos = (1/2 * canvas.height) - 1/2*imgHeight;
    //Setting current rotation and current image index to 0
    currentRotation = 0;
    currentImageIndex = 0;
    //Setting going in shell boolean to false
    goingIntoShell = false;
    //Setting walking and imgDiff to 0
    walking = 0;
    imgDiff = 0;

    stop(); //Stops all animations
    resetArrays(); //Resets all arrays to []

    draw(xPos, yPos, currentRotation, 0, false, false, false); // Draw initial position
}

function btnDance(){ //Makes the turtle dance
    walking = 0; //Set walking state to 0
    stop(); //Stoping all animations
    resetArrays(); //Resetng all arrays

    if (currentImageIndex == 11 || currentImageIndex == 12) { //If image is laser turtle or sleeping turtle then:
        draw(xPos, yPos, currentRotation, 0, false, false, false); //Draw normal turtle
        currentImageIndex = 0;
    }

    var division = 50; //Setting division for rotation

    //Make turtle come out of shell if he is in it or partially in it
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

    var clockwise = false; //Clockwise is equal to false for now

    //Determining if turtle should roate clockwise of anticlockwise
    for (var i = 0; i < 180; i++) {
        if (modulo((currentRotation + i*(Math.PI/180)), (Math.PI*2)) <= maxRotate) {
            if (modulo((currentRotation + (i+1)*(Math.PI/180)), (Math.PI*2)) >= maxRotate) {
                clockwise = true;
            }
        }
    }

    var diffAngle;

    //Rotating turtle to inital rotation (0)
    if (clockwise == true) {
        diffAngle = modulo((0 - currentRotation), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation + i*diffAngle/division), (Math.PI*2)));
            storeCoordinate(xPos, yPos, coords);
            imageIndex.push(0);
        }
    }else {
        diffAngle = modulo((currentRotation - 0), (Math.PI * 2));
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
    walking = 0;
    stop();
    resetArrays();

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
    stop();
    walking = 1;
    walk(xPos - 100, yPos - 100);
}

//--------------------Large functions--------------------//

function clickOnTurtleHead(){ //When clicking on turtle's head
    walking = 0;
    stop();
    resetArrays();

    if (goingIntoShell) {
        goingIntoShell = !goingIntoShell;
        for (var i = currentImageIndex; i >= 0; i--) {
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i);
                rotate.push(currentRotation);
                storeCoordinate(xPos, yPos, coords);
            }
        }
    }

    //Clockwise fast circle roatation
    for (var i = 0; i <= 360/3; i++) {
        rotate.push(modulo((currentRotation+(i*(Math.PI/180))*3), (Math.PI*2)));
        storeCoordinate(xPos, yPos, coords);
        imageIndex.push(12);
    }

    nextFrame(0);

}

function clickOnTurtleBody(){ //When clicking on turtle's body
    walking = 0;
    stop();
    resetArrays();

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

    var m;

    //Variables of the line between current position and mouse click
    if (xPos - toX == 0) {
        m = 80000;
    }else{
        m = (yPos-toY)/(xPos-toX);
    }
    var c = yPos-m*xPos;

    var division = 50;
    var opp;
    var adj;

    if (toX > xPos) {
        if (toY < yPos) {
            opp = Math.abs(toX - xPos);
            adj = Math.abs(toY - yPos);
            maxRotate = (Math.atan(opp/adj));
        }else{
            opp = Math.abs(toY - yPos);
            adj = Math.abs(toX - xPos);

            maxRotate = (Math.atan(opp/adj)) + (Math.PI/2);
        }
    }else {
        if (toY > yPos) {
            opp = Math.abs(toX - xPos);
            adj = Math.abs(toY - yPos);

            maxRotate = (Math.atan(opp/adj)) + (Math.PI);
        }else{
            opp = Math.abs(toY - yPos);
            adj = Math.abs(toX - xPos);

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

    var diffAngle;
    if (clockwise == true) {
        diffAngle = modulo((maxRotate - currentRotation), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation + i*diffAngle/division), (Math.PI*2)));
            storeCoordinate(xPos, yPos, coords);
        }
    }else {
        diffAngle = modulo((currentRotation - maxRotate), (Math.PI * 2));
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
