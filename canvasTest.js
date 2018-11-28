var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined
}

var maxRadius = 50;
var mouseDistance = 100;
var minRadius = 15;

var colourArray = ["#2c3e50", "#e74c3c", "#ecf0f1", "#3498db", "#298089"];

window.addEventListener("mousemove", function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

function Circle(x, dx, y, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.colour = colourArray[Math.floor(Math.random()*colourArray.length)];
    this.minRadius = radius;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.colour;
        c.fill();
    }

    this.update = function(){
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0){
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        //Interactivity
        if (mouse.x - this.x < mouseDistance && mouse.x - this.x > -mouseDistance && mouse.y - this.y < mouseDistance && mouse.y - this.y > -mouseDistance){
            if (this.radius < maxRadius) {
                this.radius += 1;
            }
        }else if (this.radius > minRadius){
            this.radius -= 1;
        }

        this.draw();
    }
}

var circleArray = [];

function init(){
    circleArray = [];
    for (var i = 0; i < 1000; i++) {
        var radius = Math.random()*10 + 1;
        var x = Math.random()*(innerWidth - radius*2) + radius;
        var dx = (Math.random()-0.5)*5;
        var y = Math.random()*(innerHeight - radius*2) + radius;
        var dy = (Math.random()-0.5)*5;

        circleArray.push(new Circle(x, dx, y, dy, radius));
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

init();
animate();
