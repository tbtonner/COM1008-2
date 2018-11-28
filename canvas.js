//Reference from the HTML page
var canvas = document.getElementById("canvas");

//Set drawing surface of canvas  to same size as the canvas
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

//Getting reference to the 2D drawing context
var context = canvas.getContext("2d");

//Setting the mouse object
var mouse = {
    x: undefined,
    y: undefined
}

//Event listener when mouse moves
window.addEventListener("mousemove", function(event){
    mouse.x = event.x;
    mouse.y = event.y;
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

function animate(){
    requestAnimationFrame(animate);
    update();
}

x=600;
y=200;

animate();
