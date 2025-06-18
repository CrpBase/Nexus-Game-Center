
// ... інші змінні збережені як є ...

function draw() {
    if (gameOver) return;

    frames++;
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
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

    // Дзеркальне зображення персонажа
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // ... логіка перешкод ...

    score++;
    ctx.fillStyle = "#fff";
    ctx.font = "20px monospace";

    // Рамка навколо NEX Points
    const scoreText = "NEX Points: " + score;
    const textWidth = ctx.measureText(scoreText).width + 20;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(canvas.width - textWidth - 20, 10, textWidth, 30);
    ctx.fillStyle = "#fff";
    ctx.fillText(scoreText, canvas.width - textWidth - 10, 30);

    // ... решта функції draw ...
}

function showGameOver(currentScore) {
    const modal = document.getElementById("gameOverModal");
    const scoreText = document.getElementById("finalScoreText");
    scoreText.textContent = "Your score: " + currentScore;
    modal.style.display = "flex";
}
