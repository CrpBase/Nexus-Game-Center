
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const music = new Audio("music.mp3");
music.loop = true;
music.volume = 0.5;

const boomSound = new Audio("BOOM.mp3");
boomSound.volume = 1.0;

const jumpSound = new Audio("jump.mp3");
jumpSound.volume = 1.0;

const backgroundImage = new Image();
backgroundImage.src = "background.png";

const overlayImage = new Image();
overlayImage.src = "station_overlay.png";

const groundImage = new Image();
groundImage.src = "ground.png";

const playerImage = new Image();
playerImage.src = "mascot.png";

const treeSingleImage = new Image();
treeSingleImage.src = "tree_single.png";

let totalPoints = parseInt(localStorage.getItem("totalScore") || "0");
let player, obstacles, frames, score, gameOver, groundx, speed, gravity, difficultyCounter, animationId, framesSinceUpgrade;

function resetGame() {
    player = { x: 60, y: 465, width: 120, height: 120, vy: 0, jumping: false };
    gravity = 0.40;
    speed = 4;
    difficultyCounter = 0;
    framesSinceUpgrade = 0;
    obstacles = [];
    frames = 0;
    score = 0;
    gameOver = false;
    groundx = 0;
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.jumping) {
        player.vy = -15;
        player.jumping = true;
        jumpSound.currentTime = 0;
        jumpSound.play().catch(() => {});
    }
});

document.addEventListener("touchstart", () => {
    if (!player.jumping) {
        player.vy = -15;
        player.jumping = true;
        jumpSound.currentTime = 0;
        jumpSound.play().catch(() => {});
    }
});

function draw() {
    if (gameOver) return;

    frames++;
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

    groundx -= speed;
    if (groundx <= -canvas.width) groundx = 0;
    ctx.drawImage(groundImage, groundx, canvas.height - 64, canvas.width, 64);
    ctx.drawImage(groundImage, groundx + canvas.width, canvas.height - 64, canvas.width, 64);

    player.y += player.vy;
    player.vy += gravity;
    if (player.y > canvas.height - 64 - player.height) {
        player.y = canvas.height - 64 - player.height;
        player.vy = 0;
        player.jumping = false;
    }
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    if (frames % 140 === 0 && framesSinceUpgrade === 0) {
        const clusterChance = Math.random();
        const spacing = 330 + (speed - 3) * 50;
        let lastObstacle = obstacles[obstacles.length - 1];
        if (!lastObstacle || lastObstacle.x < canvas.width - spacing) {
            if (clusterChance < 0.3) {
                const count = (speed > 6) ? 2 : 2 + Math.floor(Math.random() * 2);
                for (let j = 0; j < count; j++) {
                    obstacles.push({
                        x: canvas.width + j * spacing,
                        y: canvas.height - 64 - 100,
                        width: 60,
                        height: 100,
                        type: "cluster"
                    });
                }
            } else {
                obstacles.push({
                    x: canvas.width,
                    y: canvas.height - 64 - 100,
                    width: 60,
                    height: 100,
                    type: "single"
                });
            }
            difficultyCounter++;
            if (difficultyCounter > 0 && difficultyCounter % 10 === 0) {
                speed += 0.5;
                gravity += 0.03;
                framesSinceUpgrade = 15;
            }
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;
        ctx.drawImage(treeSingleImage, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y + 50
        ) {
            gameOver = true;
            music.pause();
            music.currentTime = 0;
            boomSound.currentTime = 0;
            boomSound.play().catch(() => {});
            totalPoints += score;
            localStorage.setItem("totalScore", totalPoints);
            document.getElementById("totalScore").textContent = totalPoints;
            showGameOver(score);
        }
    }

    obstacles = obstacles.filter((o) => o.x + o.width > 0);
    score++;

    ctx.fillStyle = "#fff";
    ctx.font = "20px monospace";

    const scoreText = "NEX Points: " + score;
    const textWidth = ctx.measureText(scoreText).width + 20;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(canvas.width - textWidth - 20, 10, textWidth, 30);
    ctx.fillStyle = "#fff";
    ctx.fillText(scoreText, canvas.width - textWidth - 10, 30);

    if (!gameOver) {
        if (framesSinceUpgrade > 0) framesSinceUpgrade--;
        animationId = requestAnimationFrame(draw);
    }
}

function showGameOver(currentScore) {
    const modal = document.getElementById("gameOverModal");
    const scoreText = document.getElementById("finalScoreText");
    scoreText.textContent = "Your score: " + currentScore;
    modal.style.display = "flex";
}



window.startGame = function startGame() {
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("gameOverModal").style.display = "none";
    music.currentTime = 0;
    music.play().catch(() => {});
    resetGame();
    cancelAnimationFrame(animationId);
    draw();
}

window.backToMenu = function backToMenu() {
    document.getElementById("menu").style.display = "flex";
    canvas.style.display = "none";
    document.getElementById("gameOverModal").style.display = "none";
    music.pause();
    music.currentTime = 0;
}
