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
var x = (1/2 * canvas.width) - 1/2*imgWidth;
var y = (1/2 * canvas.height) - 1/2*imgHeight;

//Event listener when mouse moves
window.addEventListener("click", function(event){
    context.clearRect(0, 0, canvas.width, canvas.height);

    mouse.x = event.x;
    mouse.y = event.y;

    x = mouse.x - 1/2*imgWidth;
    y = mouse.y - 1/2*imgHeight;

    draw();
});

//Event listener when window size is changed
window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = 600;

    draw();
});


function draw(){
    var img = new Image();
    img.onload = function() {
        context.drawImage(img, x, y);
    }
    img.src = "./turtle1.png";
}

function update(){
    x = mouse.x;
    y = mouse.y;

    draw();
}

draw();
