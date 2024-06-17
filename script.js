/**
 * ICS4U - Final Project
 *
 * Description:
 *
 * Author: Wadley Moise
 */

'use strict';


const canvas = document.getElementById('poolCanvas');
const ctx = canvas.getContext('2d');

let radius = 10;
let GameOver = false
const FRICTION = 0.98;
const COLORS = [
    '#ffffff', '#ff0000', '#0000ff', '#00ff00', '#ff00ff',
    '#00ffff', '#ffff00', '#ffa500', '#800080', '#808080',
    '#8b4513', '#000000', '#ff6347', '#4682b4', '#d2691e',
    '#b22222'
];

class Ball {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move(index) {
      let i = index
        this.vx *= FRICTION;
        this.vy *= FRICTION;
        this.x += this.vx;
        this.y += this.vy;

        // Handle collisions with the walls
        if (this.x + radius > canvas.width - 20 && !this.doesBallPassThrough(i)) {
            this.x = canvas.width - radius - 21
            this.vx = -this.vx;
        }
        if (this.x - radius < + 20 && !this.doesBallPassThrough(i)){

          this.x = radius + 21
          this.vx = -this.vx;
        }

        if (this.y + radius > canvas.height - 20 && !this.doesBallPassThrough(i)) {
            this.y = canvas.height - radius - 21
            this.vy = -this.vy;
        }

        if (this.y - radius < 20 && !this.doesBallPassThrough(i)){

          this.y = radius + 21
          this.vy = -this.vy;
        }
    }

    doesBallPassThrough (index) {
      // Check if the ball is near any of the pockets

      for (let i = 0; i < pockets.length; i += 2) {

          let dx = this.x - pockets[i];
          let dy = this.y - pockets[i+1];
          let distance = Math.sqrt(dx * dx + dy * dy);

          // Allow the ball to move further if it's close to a pocket
          if (distance < 15 + 10) {

              balls[index] = null
              if (balls[0] == null){
                GameOver = true
              }
              return true;
          }
      }
      return false;
  }

    checkCollision(otherBall) {
      let dx = otherBall.x - this.x;
      let dy = otherBall.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius * 2) {
         // Calculate the angle of the collision
    let collisionAngle = Math.atan2(dy, dx);

    // Calculate initial velocities in the direction of the collision
    let v1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    let v2 = Math.sqrt(otherBall.vx * otherBall.vx + otherBall.vy * otherBall.vy);
    let direction1 = Math.atan2(this.vy, this.vx);
    let direction2 = Math.atan2(otherBall.vy, otherBall.vx);

    // Decompose the velocities into the normal (collision) direction
    let v1x = v1 * Math.cos(direction1 - collisionAngle);
    let v1y = v1 * Math.sin(direction1 - collisionAngle);
    let v2x = v2 * Math.cos(direction2 - collisionAngle);
    let v2y = v2 * Math.sin(direction2 - collisionAngle);


    //Conservation of Momentum
    this.vx = Math.cos(collisionAngle) * v2x + Math.cos(collisionAngle + Math.PI / 2) * v1y
    this.vy = Math.sin(collisionAngle) * v2x + Math.sin(collisionAngle + Math.PI / 2) * v1y
    otherBall.vx = Math.cos(collisionAngle) * v1x + Math.cos(collisionAngle + Math.PI / 2) * v2y
    otherBall.vy = Math.sin(collisionAngle) * v1x + Math.sin(collisionAngle + Math.PI / 2) * v2y

    // Resolve overlap
    const overlap = (radius * 2 - distance) / 2;
    const nx = dx / distance;
    const ny = dy / distance;
    this.x -= overlap * nx;
    this.y -= overlap * ny;
    otherBall.x += overlap * nx;
    otherBall.y += overlap * ny;




    }
  }
}

const balls = [];
const cueBall = new Ball(100, 200, COLORS[0]);
balls.push(cueBall);

let pockets = [
  30, 30,                                 // Top-left pocket
  canvas.width / 2, 15,                   // Top-center pocket
  canvas.width - 30, 30,                  // Top-right pocket
  30, canvas.height - 30,                 // Bottom-left pocket
  canvas.width / 2, canvas.height - 15,   // Bottom-center pocket
  canvas.width - 30, canvas.height - 30  // Bottom-right pocket
];
// Positioning the balls in a triangle rack
let startX = 600;
let startY = 200;
let x;
let y;
let row = 0;
let count = 0;
for (let i = 1; i < 6; i++) {
    for (let j = 0; j < i; j++) {
         x = startX + (radius* 2 + 1) * row;
         y = startY - (radius * 2 + 1) * (i / 2) + j * (radius* 2 + 1);
        balls.push(new Ball(x, y, COLORS[count + 1]));
        count++;
    }
    row++;
}

function drawTable() {
  // Draw table surface
  ctx.fillStyle = '#008000';  // green color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw railings (borders)
  ctx.strokeStyle = '#964B00';  // brown color
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Draw pockets (sockets)
  ctx.fillStyle = '#000';  // black color
  for (let i = 0; i < pockets.length; i += 2) {


    ctx.beginPath();
    ctx.arc(pockets[i], pockets[i + 1], 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
}



function update() {

  if (!GameOver){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTable();
    for (let i = 0; i < balls.length; i++){
      if (balls[i] != null){
      balls[i].move(i)
      if (balls[i] != null){
      balls[i].draw()
      }
    }
    }



    // Check collisions between balls
   for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          if (balls[i] != null && balls[j] != null){
            balls[i].checkCollision(balls[j]);
          }
        }
    }
  }
  else{
    drawGameOverScreen()
  }

    requestAnimationFrame(update);
}

canvas.addEventListener('click', (event) => {
  if (!GameOver){
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if ((Math.abs(balls[0].vx) < 0.06 && Math.abs(balls[0].vy) < 0.06)){
    // Calculate velocity based on distance to mouse click
    cueBall.vx = (mouseX - cueBall.x) / 10;
    cueBall.vy = (mouseY - cueBall.y) / 10;
    }
  }
});

function drawGameOverScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  GameOver = true

  ctx.font = '30px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '20px Arial';
  ctx.fillText('Press any key to play again', canvas.width / 2, canvas.height / 2 + 20);
}

document.addEventListener('keydown', function(event) {
  if (GameOver) {
      resetGame();
  }
});

function resetGame() {
  GameOver = false;
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for( let i = 0; i < balls.length; i++){
    balls[i] = null
  }

startX = 600;
startY = 200;
x;
y;
row = 0;
count = 0;
balls.push(new Ball(100, 200, COLORS[0]));

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < i; j++) {
         x = startX + (radius* 2 + 1) * row;
         y = startY - (radius * 2 + 1) * (i / 2) + j * (radius* 2 + 1);
        balls.push(new Ball(x, y, COLORS[count + 1]));
        count++;
    }
    row++;
}

  // Restart game loop
  update();
}




update();
