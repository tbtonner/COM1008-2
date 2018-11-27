var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener("mousemove", function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

function Circle(x, dx, y, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = "black";
        c.strokeStyle = "blue";
        c.stroke();
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
        if (mouse.x - this.x < 100 && mouse.x - this.x > -100 && mouse.y - this.y < 100 && mouse.y - this.y > -100){
            if (this.radius < 50) {
                this.radius += 2;
            }
        }else if (this.radius > 20){
            this.radius -= 2;
        }

        this.draw();
    }
}

var circleArray = [];

for (var i = 0; i < 750; i++) {
    var radius = 20;
    var x = Math.random()*(innerWidth - radius*2) + radius;
    var dx = (Math.random()-0.5)*5;
    var y = Math.random()*(innerHeight - radius*2) + radius;
    var dy = (Math.random()-0.5)*5;

    circleArray.push(new Circle(x, dx, y, dy, radius));
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

animate();
