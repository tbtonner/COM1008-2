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

//Setting initial position of the turtle
var xPos = (1/2 * canvas.width) - 1/2*imgWidth;
var yPos = (1/2 * canvas.height) - 1/2*imgHeight;

//Variables of the line between current position and mouse click
var m = (yPos-mouse.y)/(xPos-mouse.x);
var c = yPos-m*xPos;
var coords = [];

//Event listener when mouse moves
window.addEventListener("click", function(event){
    coords = [];

    context.clearRect(0, 0, canvas.width, canvas.height);

    mouse.x = event.x - 1/2*imgWidth;
    mouse.y = event.y- 1/2*imgHeight;

    for (var xCurrent = xPos; xCurrent < mouse.x; xCurrent++) {
        var yCurrent = m*xCurrent + c;
        storeCoordinate(xCurrent, yCurrent, coords);
    }

    animate();

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

function draw(x, y){
    var img = new Image();
    img.onload = function() {
        context.drawImage(img, x, y);
    }
    img.src = "./turtle1.png";
}

function animate(){
    requestAnimationFrame(animate);
    // context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < coords.length; i++) {
        draw(coords[i].x, coords[i].y);
        if (i == coords.length){
            cancelAnimationFrame(animate);
        }
    }
}

draw(xPos, yPos);
