//Reference from the HTML page
var canvas = document.getElementById("canvas");

//Set drawing surface of canvas  to same size as the canvas
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

//Getting reference to the 2D drawing context
var context = canvas.getContext("2d");

//Function to draw the image
function draw(){
    var img = new Image();
    img.onload = function() {
        context.drawImage(img,50,50);
    }
    img.src = "./turtle1.png";
}

draw(context);
