const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const batImg = new Image();
batImg.src = 'assets/bat.png';
const ballImg = new Image();
ballImg.src = 'assets/ball.png';
const bounceSound = new Audio('assets/bounce.wav');

let score = 0;
let bat = {
    x: canvas.width / 2 - 50,
    width: 100,
    height: 20,
    speed: 5,
    angle: 0
};

let balls = [{
    x: canvas.width / 2,
    y: 100,
    radius: 15,
    dy: 3,
    initialSpeed: 3
}];

let gameRunning = true;
let lastBallTime = Date.now();
const ballInterval = 10000; // 10 seconds

function update() {
    if (!gameRunning) return;

    // Move bat
    if (rightPressed) bat.x += bat.speed;
    if (leftPressed) bat.x -= bat.speed;
    if (bat.x < 0) bat.x = 0;
    if (bat.x + bat.width > canvas.width) bat.x = canvas.width - bat.width;

    // Update balls
    balls.forEach((ball, index) => {
        ball.y += ball.dy;

        // Collision with bat
        if (ball.y + ball.radius > canvas.height - bat.height && 
            ball.x > bat.x && 
            ball.x < bat.x + bat.width) {
            ball.dy = -ball.initialSpeed;
            score += 1;
            bounceSound.play();
            ball.initialSpeed += 0.2; // Increase difficulty
        }

        // Game over if ball misses bat
        if (ball.y > canvas.height) {
            gameRunning = false;
            alert(`Game Over! Score: ${score}`);
        }
    });

    // Add new ball every 10 seconds
    if (Date.now() - lastBallTime > ballInterval) {
        balls.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            radius: 15,
            dy: 3,
            initialSpeed: 3
        });
        lastBallTime = Date.now();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bat
    ctx.save();
    ctx.translate(bat.x + bat.width/2, canvas.height - bat.height/2);
    ctx.rotate(bat.angle * Math.PI / 180);
    ctx.drawImage(batImg, -bat.width/2, -bat.height/2, bat.width, bat.height);
    ctx.restore();

    // Draw balls
    balls.forEach(ball => {
        ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    });

    // Update score
    document.getElementById('score').textContent = `Score: ${score}`;
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowUp' && bat.angle > -30) bat.angle -= 5;
    if (e.key === 'ArrowDown' && bat.angle < 30) bat.angle += 5;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'ArrowLeft') leftPressed = false;
});

function gameLoop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

batImg.onload = () => {
    ballImg.onload = () => {
        gameLoop();
    };
};

// For GitHub Pages compatibility
if (window.location.pathname.includes('github.io')) {
    batImg.src = '/cricket-bat-game/assets/bat.png';
    ballImg.src = '/cricket-bat-game/assets/ball.png';
    bounceSound.src = '/cricket-bat-game/assets/bounce.wav';
}
