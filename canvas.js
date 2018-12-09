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

//Setting imange difference between turtleLaser and all others to 0 (for now)
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

    if (yMouse <= canvas.height - 1/2*imgHeight) { //If mouse click was inside canvas
        if (Math.abs(xMouse - xPos) < 1/2*imgWidth &&  Math.abs(yMouse - yPos) < 1/2*imgHeight) { //If click was on turtle:
            if  (Math.sqrt(Math.pow((yMouse - yPos), 2) + Math.pow((xMouse - xPos), 2)) >= 60){ //If click was not on turtle's shell
                clickOnTurtleHead();
            }else{
                clickOnTurtleBody();
            }
        }else{ //If mouse click was on canvas and not on turtle:
            walking = 0; //Set walking state to 0
            stop(); //Stop all animations
            walk(xMouse, yMouse); //Walk to mouse position
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

        image.src = imgSource[i]; //Image source = imgSource array in position i
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
    if (walking == 1) { //If walking state = 1
        walking++; //Increment walking state
        walk(xPos + 200, yPos); //Walk to current x + 200px
    }else if (walking == 2) { //If walking state = 2
        walking++; //Increment walking state
        walk(xPos, yPos + 200); //Walk to current y + 200px
    }else if (walking == 3) { //If walking state = 3
        walking++; //Increment walking state
        walk(xPos - 200, yPos); //Walk to current x - 200px
    }else if (walking == 4) { //If walking state = 4
        walk(xPos, yPos - 200); //Walk to current y - 200px
        walking = 0; //Set walking state to 0
    }
}

function fastRotation(div, clockwise, index, rotation){ //Function to ratate turtle in 360 degree rotation quickly
    var sign; //Sign +-1 depending on rotation
    if (clockwise) { //If clockwise = true:
        sign = 1;
    }else { //Else:
        sign = -1;
    }

    for (var i = 0; i <= 360/div; i++) { //For i = 0 to 359
        rotate.push(modulo(rotation+(sign*i*(Math.PI/180))*div, (Math.PI*2))); //Add an instance of rotation at that point
        storeCoordinate(xPos, yPos, coords); //Add an instance current coordinates
        imageIndex.push(index); //Add an instance of normal turtle image
    }
}

function sleepOrLaser(){ //Function to turn sleep or laser turtle into normal turtle
    if (currentImageIndex == 11 || currentImageIndex == 12) { //If image is laser turtle or sleeping turtle then:
        draw(xPos, yPos, currentRotation, 0, false, false, false); //Draw normal turtle
        currentImageIndex = 0; //Image index to normal turtle
    }
}

function outOfShell(){ //Function to change semi or completely in shell turtle into normal turtle
    //Make turtle come out of shell if he is in it or partially in it
    if (currentImageIndex != 0) { //If image isn't normal turtle:
        //Come out of shell from current position until normal turtle
        goingIntoShell = false; //No longer going into shell
        for (var i = currentImageIndex; i >= 0; i--) { //For loop until normal turtle index
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i); //Adding 5 instances of imageIndex[i]
                rotate.push(currentRotation); //Adding 5 instances of current rotation
                storeCoordinate(xPos, yPos, coords); //Adding 5 instances of current x and y coordinates
            }
        }
    }
}

function rotateToPosition(rotation){ //Function to rotate turtle to angle = rotation
    var division = 50; //Setting division for rotation
    var clockwise = false; //Clockwise is equal to false for now

    //Determining if turtle should roate clockwise of anticlockwise
    if (walking != 0 && walking != 1) {
        clockwise = true; //Clockwise rotations if walking state is not 0 and not 1
    }else{
        for (var i = 0; i < 180; i++) { //For i = 0 to 179
            //Find a position where currentRotation + i (in rads) < maxRotate < currentRotation + i + 1 (in rads)
            if (modulo((currentRotation + i*(Math.PI/180)), (Math.PI*2)) <= maxRotate) { //If currentRotation + i(in rads) is less than maxRotate:
                if (modulo((currentRotation + (i+1)*(Math.PI/180)), (Math.PI*2)) >= maxRotate) { //If currentRotation + i+1(in rads) is more than maxRotate:
                    clockwise = true; //Turning clockwise
                }
            }
        }
    }

    var diffAngle; //Difference between currentRotation and maxRotate

    //Rotating turtle to inital rotation (0)
    if (clockwise == true) { //If turning clockwise:
        diffAngle = modulo((rotation - currentRotation), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation + i*diffAngle/division), (Math.PI*2))); //Add an instance of rotation at that point
            storeCoordinate(xPos, yPos, coords);  //Adding 1 instance of current x and y coordinates
            imageIndex.push(0); //Adding 1 instance of normal turtle image
        }
    }else { //If turning anti-clockwise:
        diffAngle = modulo((currentRotation - rotation), (Math.PI * 2));
        for (var i = 0; i < division; i++) {
            rotate.push(modulo((currentRotation - i*diffAngle/division), (Math.PI*2))); //Add an instance of rotation at that point
            storeCoordinate(xPos, yPos, coords); //Adding 1 instance of current x and y coordinates
            imageIndex.push(0); //Adding 1 instance of normal turtle image
        }
    }
}

//--------------------Button functions--------------------//

function btnReset(){ //Resets entire screen
    //Resetting x and y positions to middle of screen
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
    stop(); //stopping all animations
    resetArrays(); //resetting all arrays

    sleepOrLaser();
    outOfShell();

    rotateToPosition(0);

    //Clockwise fast circle rotation
    fastRotation(6, true, 0, 0);

    //Anti-clockwise fast circle rotation
    fastRotation(6, false, 0, 0);

    var dis = 10;
    var danceSpeed = 4;

    //Moving from side to side
    for (var i = 0; i < dis; i++) { //Move a distance of 10 to right
        rotate.push(0); //Add an instance of rotation with 0 rotate
        storeCoordinate(xPos + i*danceSpeed, yPos, coords); //Add an instance of position of turtle at that point
        imageIndex.push(0); //Add an instance of normal turtle image
    }
    for (var i = dis; i > -dis; i--) { //Move a distance of 20 to left
        rotate.push(0); //Add an instance of rotation with 0 rotate
        storeCoordinate(xPos + i*danceSpeed, yPos, coords); //Add an instance of position of turtle at that point
        imageIndex.push(0); //Add an instance of normal turtle image
    }
    for (var i = -dis; i < 0; i++) { //Move a distance of 10 to right
        rotate.push(0); //Add an instance of rotation with 0 rotate
        storeCoordinate(xPos + i*danceSpeed, yPos, coords); //Add an instance of position of turtle at that point
        imageIndex.push(0); //Add an instance of normal turtle image
    }

    //y
    for (var i = 0; i < dis; i++) {
        rotate.push(0); //Add an instance of rotation with 0 rotate
        storeCoordinate(xPos, yPos + i*danceSpeed, coords); //Add an instance of position of turtle at that point
        imageIndex.push(0); //Add an instance of normal turtle image
    }
    for (var i = dis; i > -dis; i--) {
        rotate.push(0); //Add an instance of rotation with 0 rotate
        storeCoordinate(xPos, yPos + i*danceSpeed, coords); //Add an instance of position of turtle at that point
        imageIndex.push(0); //Add an instance of normal turtle image
    }
    for (var i = -dis; i < 0; i++) {
        rotate.push(0); //Add an instance of rotation with 0 rotate
        storeCoordinate(xPos, yPos + i*danceSpeed, coords); //Add an instance of position of turtle at that point
        imageIndex.push(0); //Add an instance of normal turtle image
    }

    //Clockwise fast circle rotation
    fastRotation(6, true, 0, 0);

    //Adding false to sleep 1,2 and 3 coords.length number of times
    for (var i = 0; i < coords.length; i++) {
        sleep1.push(false); //Set sleep 1 to false
        sleep2.push(false); //Set sleep 2 to false
        sleep3.push(false); //Set sleep 3 to false
    }

    animate(0); //Calling animation
}

function btnSleep(){ //Makes the turtle sleep
    walking = 0; //Set walking state to 0
    stop(); //stopping all animations
    resetArrays(); //resetting all arrays

    sleepOrLaser();
    outOfShell();

    //Adding false to sleep 1,2 and 3 coords.length number of times
    for (var i = 0; i < coords.length; i++) {
        sleep1.push(false); //Set sleep 1 to false
        sleep2.push(false); //Set sleep 2 to false
        sleep3.push(false); //Set sleep 3 to false
    }

    for (var i = 0; i < 160; i++) { //For i = 0 to 159
        imageIndex.push(11); //Add image of turtle with closed eyes
        rotate.push(currentRotation); //Add an instance of rotation with currentRotation
        storeCoordinate(xPos, yPos, coords); //Add an instance of position of turtle at that point
        if (i < 40) {
            sleep1.push(false); //Set sleep 1 to false
            sleep2.push(false); //Set sleep 2 to false
            sleep3.push(false); //Set sleep 3 to false
        }else if (i < 80) {
            sleep1.push(true); //Set sleep 1 to true
            sleep2.push(false); //Set sleep 2 to false
            sleep3.push(false); //Set sleep 3 to false
        }else if (i < 120) {
            sleep1.push(true); //Set sleep 1 to true
            sleep2.push(true); //Set sleep 2 to true
            sleep3.push(false); //Set sleep 3 to false
        }else if (i < 160) {
            sleep1.push(true); //Set sleep 1 to true
            sleep2.push(true); //Set sleep 2 to true
            sleep3.push(true); //Set sleep 3 to true
        }
    }

    animate(0); //Animate event
}

function btnWalk(){ //What happens when walk button is pressed
    stop(); //Stop all current animations
    walking = 1; //Set walking state to 1
    walk(xPos - 100, yPos - 100); //Start walk by going to starting position
}

//--------------------Large functions--------------------//

function clickOnTurtleHead(){ //When clicking on turtle's head
    walking = 0; //Set walking state to 0
    stop(); //Stopping all animations
    resetArrays(); //Resetting all arrays

    sleepOrLaser();
    outOfShell();

    //Clockwise fast circle rotation
    fastRotation(3, true, 12, currentRotation);

    animate(0); //Animate event

}

function clickOnTurtleBody(){ //When clicking on turtle's body
    walking = 0; //Set walking state to 0
    stop(); //Stopping all animations
    resetArrays(); //Resetting all arrays

    goingIntoShell = !goingIntoShell; //Change going in shell to oposite

    sleepOrLaser();

    if (goingIntoShell) { //If goingIntoShell = true:
        for (var i = currentImageIndex; i < 11; i++) { //For loop until turtle in shell index
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i); //Adding 5 instances of imageIndex[i]
                rotate.push(currentRotation); //Adding 5 instances of current rotation
                storeCoordinate(xPos, yPos, coords); //Adding 5 instances of current x and y coordinates
            }
        }
    }else{
        for (var i = currentImageIndex; i >= 0; i--) { //For loop until normal turtle index
            for (var t = 0; t < 5; t++) {
                imageIndex.push(i); //Adding 5 instances of imageIndex[i]
                rotate.push(currentRotation); //Adding 5 instances of current rotation
                storeCoordinate(xPos, yPos, coords); //Adding 5 instances of current x and y coordinates
            }
        }
    }

    //Adding false to sleep 1,2 and 3 coords.length number of times
    for (var i = 0; i < coords.length; i++) {
        sleep1.push(false); //Set sleep 1 to false
        sleep2.push(false); //Set sleep 2 to false
        sleep3.push(false); //Set sleep 3 to false
    }

    animate(0); //Calling animation
}

function walk(toX, toY){ //Function to walk from current position to (toX, toY) coordinates with animation
    resetArrays(); //Resetting all arrays

    sleepOrLaser();
    outOfShell();

    var m; //Gradiant of line

    //Variables of the line between current position and mouse click
    if (xPos - toX == 0) {
        m = 80000; //To prevent errors when m=infinite
    }else{
        m = (yPos-toY)/(xPos-toX); //Gradiant of line using line equations
    }
    var c = yPos-m*xPos; //y-intercept of line

    var division = 50; //How much rotation is divided up to
    var opp; //Opposite of triangle
    var adj; //Adjacent of triangle

    if (toX > xPos) {
        if (toY < yPos) {
            opp = Math.abs(toX - xPos); //Opposite in triangle is equal to
            adj = Math.abs(toY - yPos); //Adjacent in triangle is equal to

            maxRotate = (Math.atan(opp/adj)); //Max rotate is using tan
        }else{
            opp = Math.abs(toY - yPos); //Opposite in triangle is equal to
            adj = Math.abs(toX - xPos); //Adjacent in triangle is equal to

            maxRotate = (Math.atan(opp/adj)) + (Math.PI/2); //Max rotate is using tan
        }
    }else {
        if (toY > yPos) {
            opp = Math.abs(toX - xPos); //Opposite in triangle is equal to
            adj = Math.abs(toY - yPos); //Adjacent in triangle is equal to

            maxRotate = (Math.atan(opp/adj)) + (Math.PI); //Max rotate is using tan
        }else{
            opp = Math.abs(toY - yPos); //Opposite in triangle is equal to
            adj = Math.abs(toX - xPos); //Adjacent in triangle is equal to

            maxRotate = (Math.atan(opp/adj)) + (3*Math.PI/2); //Max rotate is using tan
        }
    }

    rotateToPosition(maxRotate);

    var speed = 3; //Set speed of movement

    if (Math.abs(yPos-toY)>Math.abs(xPos-toX)) { //If difference in distance between y variables is bigger than distance between x variables:
        if (toY > yPos) {
            for (var yCurrent = yPos; yCurrent < toY; yCurrent=yCurrent+speed) {
                var xCurrent = (yCurrent - c)/m; //Calculated x point in that moment
                storeCoordinate(xCurrent, yCurrent, coords); //Adding coordinates of turtle at that point
                rotate.push(maxRotate); //Adding maxRotate to rotate array
            }
        }else{
            for (var yCurrent = yPos; yCurrent > toY; yCurrent=yCurrent-speed) {
                var xCurrent = (yCurrent - c)/m; //Calculated x point in that moment
                storeCoordinate(xCurrent, yCurrent, coords); //Adding coordinates of turtle at that point
                rotate.push(maxRotate); //Adding maxRotate to rotate array
            }
        }
    }else{
        if (toX > xPos) {
            for (var xCurrent = xPos; xCurrent < toX; xCurrent=xCurrent+speed) {
                var yCurrent = m*xCurrent + c; //Calculated y point in that moment
                storeCoordinate(xCurrent, yCurrent, coords); //Adding coordinates of turtle at that point
                rotate.push(maxRotate); //Adding maxRotate to rotate array
            }
        }else{
            for (var xCurrent = xPos; xCurrent > toX; xCurrent=xCurrent-speed) {
                var yCurrent = m*xCurrent + c; //Calculated y point in that moment
                storeCoordinate(xCurrent, yCurrent, coords); //Adding coordinates of turtle at that point
                rotate.push(maxRotate); //Adding maxRotate to rotate array
            }
        }
    }

    for (var i = 0; i < coords.length; i++) {
        imageIndex.push(0); //Set image to normal turtle image

        sleep1.push(false); //Set sleep 1 to false
        sleep2.push(false); //Set sleep 2 to false
        sleep3.push(false); //Set sleep 3 to false
    }

    animate(0); //Animate the event
}

function draw(x, y, rotation, imgIndex, sleep_1, sleep_2, sleep_3){ //Draw turtle and other items on screen with given perameters

    if (imgIndex == 12) { //If laser turtle:
        imgDiff = 215; //Set image difference to 215
    }else {
        imgDiff = 0; //If not laser turtle then no image difference
    }

    context.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas

    context.save(); //Save the context
    context.translate(x + imgWidth/2, y + imgHeight/2); //Change the origin to centre of image
    context.rotate(rotation); //Rotate context to current rotation
    if (sleep_1) { //If sleep 1 = true
        context.font = "25px Arial"; //Font and font size
        context.fillText("Z",-75,-100); //Draw Z on those coordinates
    }

    if (sleep_2) { //If sleep 2 = true
        context.font = "50px Arial"; //Font and font size
        context.fillText("Z",-105,-140); //Draw Z on those coordinates
    }

    if (sleep_3) { //If sleep 3 = true
        context.font = "75px Arial"; //Font and font size
        context.fillText("Z",-150,-200); //Draw Z on those coordinates
    }
    context.drawImage(img[imgIndex],-imgWidth/2,-imgHeight/2-imgDiff); //Draw the image on context
    context.restore(); //Restore the context

}

function animate(i) { //Changing for each animation frame
    xPos = coords[i].x; //xPos = current x at frame time
    yPos = coords[i].y; //yPos = current y at frame time
    currentRotation = rotate[i]; //currentRotation = current rotation at frame time
    currentImageIndex = imageIndex[i]; //currentImageIndex = current image index at frame time

    draw(coords[i].x, coords[i].y, rotate[i], imageIndex[i], sleep1[i], sleep2[i], sleep3[i]); //Draw with current values
    requestId = requestAnimationFrame(function() { //Request animation frame
        animate(i);
    });

    i++;
    if (i == coords.length) { //If i = coords.length:
        stop(); //Stop all animations
    }
}

//--------------------Initial Run Code--------------------//
loadImages(); //Loads all images and draws the first initial image on canvas
