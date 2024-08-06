// script.js

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');
canvas.width = 800;
canvas.height = 800;
const cellSize = 40;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let maze = [];
let player = { x: 0, y: 0 };
let exit = { x: cols - 1, y: rows - 1 };

// Maze generation using recursive backtracking
function generateMaze() {
    const directions = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
    ];

    const stack = [];
    maze = Array(rows).fill().map(() => Array(cols).fill(1));
    let current = { x: 0, y: 0 };
    maze[current.y][current.x] = 0;

    while (true) {
        const neighbors = directions.map(dir => ({
            x: current.x + dir.x * 2,
            y: current.y + dir.y * 2,
            dir
        })).filter(({ x, y }) =>
            x >= 0 && x < cols && y >= 0 && y < rows && maze[y][x] === 1
        );

        if (neighbors.length === 0) {
            if (stack.length === 0) break;
            current = stack.pop();
            continue;
        }

        stack.push(current);
        const { x, y, dir } = neighbors[Math.floor(Math.random() * neighbors.length)];
        maze[current.y + dir.y][current.x + dir.x] = 0;
        maze[y][x] = 0;
        current = { x, y };
    }
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maze.forEach((row, y) => row.forEach((cell, x) => {
        ctx.fillStyle = cell ? '#000' : '#fff';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }));
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = 'green';
    ctx.fillRect(exit.x * cellSize, exit.y * cellSize, cellSize, cellSize);
}

function handleKey(e) {
    const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowRight: { x: 1, y: 0 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }
    };

    const { x, y } = keyMap[e.key] || {};
    if (x === undefined || y === undefined) return;

    const newX = player.x + x;
    const newY = player.y + y;
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze();

        if (player.x === exit.x && player.y === exit.y) {
            messageDiv.innerHTML = "Congratulations! You've completed the hardest game and won a Ferrero Rocher chocolate and a Nuts Overloaded ice cream!";
            messageDiv.style.display = 'block';
        }
    }
}

generateMaze();
drawMaze();
window.addEventListener('keydown', handleKey);
