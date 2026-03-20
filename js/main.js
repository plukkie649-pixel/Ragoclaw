// Game State
let gameInterval;
let score = 0;
let clickScore = 0;

// Utility to load game
window.loadGame = function(gameType) {
    const gameArea = document.getElementById('game-area');
    const gameTitle = document.getElementById('game-title');
    
    // Clear previous game if running
    if (gameInterval) clearInterval(gameInterval);

    if (gameType === 'snake') {
        gameTitle.innerText = "Snake";
        gameArea.innerHTML = `
            <canvas id="gameCanvas" width="300" height="300"></canvas>
            <div class="controls">
                <button onclick="setDirection('UP')">▲</button>
                <div class="middle-controls">
                    <button onclick="setDirection('LEFT')">◀</button>
                    <button onclick="setDirection('RIGHT')">▶</button>
                </div>
                <button onclick="setDirection('DOWN')">▼</button>
            </div>
        `;
        initSnake();
    } else if (gameType === 'clicker') {
        gameTitle.innerText = "Code Clicker";
        gameArea.innerHTML = `
            <div class="score-board">
                <span id="score">0</span> Code Punten
            </div>
            <button class="btn-primary" onclick="incrementScore()">Schrijf Code</button>
        `;
        clickScore = 0;
    }
};

// Snake Logic
let box = 20;
let snake = [];
let food = {};
let d = "RIGHT";

function initSnake() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    snake = [{ x: 9 * box, y: 10 * box }];
    food = { x: Math.floor(Math.random() * 14 + 1) * box, y: Math.floor(Math.random() * 14 + 1) * box };
    d = "RIGHT";
    score = 0;
    gameInterval = setInterval(() => drawSnake(ctx, canvas), 120);
}

document.addEventListener("keydown", (e) => {
    if(e.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if(e.keyCode == 38 && d != "DOWN") d = "UP";
    else if(e.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if(e.keyCode == 40 && d != "UP") d = "DOWN";
});

window.setDirection = function(newDir) {
    if(newDir == "LEFT" && d != "RIGHT") d = "LEFT";
    else if(newDir == "UP" && d != "DOWN") d = "UP";
    else if(newDir == "RIGHT" && d != "LEFT") d = "RIGHT";
    else if(newDir == "DOWN" && d != "UP") d = "DOWN";
};

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function drawSnake(ctx, canvas) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 300, 300);

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#4f46e5" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    if(snakeX == food.x && snakeY == food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 14 + 1) * box, y: Math.floor(Math.random() * 14 + 1) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameInterval);
        ctx.fillStyle = "white";
        ctx.font = "20px Inter";
        ctx.fillText("Game Over! Score: " + score, 60, 150);
        ctx.fillText("Klik om te herstarten", 40, 180);
        canvas.onclick = () => initSnake();
        return;
    }

    snake.unshift(newHead);
}

// Code Clicker Logic
window.incrementScore = function() {
    clickScore++;
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = clickScore;
    }
};
