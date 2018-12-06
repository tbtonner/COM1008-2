//Reference from the HTML page
var canvas = document.getElementById("canvas");

//Set drawing surface of canvas  to same size as the canvas
canvas.width = window.innerWidth;
canvas.height = 600;

//Getting reference to the 2D drawing context
var context = canvas.getContext("2d");

//Setting image height and width
var imgWidth = 169;
var imgHeight = 237;

//Setting initial position of the turtle
var xPos = (1/2 * canvas.width) - 1/2*imgWidth;
var yPos = (1/2 * canvas.height) - 1/2*imgHeight;

var imgSource = ["./turtle.png", "./turtleGoingToShell1.png", "./turtleGoingToShell2.png", "./turtleGoingToShell3.png",
"./turtleGoingToShell4.png", "./turtleGoingToShell5.png", "./turtleGoingToShell6.png", "./turtleGoingToShell7.png",
 "./turtleGoingToShell8.png", "./turtleGoingToShell9.png", "./turtleInShell.png"];

function imgpreload(imgs) {

    function callback (){}

    var loaded = 0;
    images = [];

    imgs = Object.prototype.toString.apply(imgs) === '[object Array]' ? imgs : [imgs];

    var inc = function() {
        loaded += 1;
        if ( loaded === imgs.length && callback ) {
            callback();
        }
    };

    for ( var i = 0; i < imgs.length; i++ ) {
        images[i] = new Image();
        images[i].onabort = inc;
        images[i].onerror = inc;
        images[i].onload = inc;
        images[i].src = imgs[i];
    }
}

var images = [];

imgpreload(imgSource);

function btnSleep(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.drawImage(images[3], 0, 0);
    context.restore();
}
