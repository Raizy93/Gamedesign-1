 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/script.js b/js/script.js
index 85a3ae8729b3f179555c762519b5230623cd6996..3327b9b7b3178e5318f045a85c26387ade5fbbf7 100644
--- a/js/script.js
+++ b/js/script.js
@@ -1,2 +1,224 @@
-const app = document.getElementById('app');
-app.innerHTML = `<h2>${artikelen[0].titel}</h2><p>${artikelen[0].tekst}</p>`;
+const canvas = document.getElementById('game');
+const ctx = canvas.getContext('2d');
+const scoreEl = document.getElementById('score');
+const highscoreEl = document.getElementById('highscore');
+const messageEl = document.getElementById('message');
+const restartBtn = document.getElementById('restart');
+
+const gridSize = 20;
+const tileSize = canvas.width / gridSize;
+const startSpeedMs = 120;
+
+let snake;
+let direction;
+let nextDirection;
+let food;
+let score;
+let highscore = Number(localStorage.getItem('snakeHighscore') || 0);
+let gameInterval = null;
+let hasStarted = false;
+
+highscoreEl.textContent = highscore;
+resetGame();
+draw();
+
+window.addEventListener('keydown', (event) => {
+  const key = event.key.toLowerCase();
+  const requestedDirection = getDirectionFromKey(key);
+
+  if (!requestedDirection) {
+    return;
+  }
+
+  event.preventDefault();
+
+  if (isReverse(requestedDirection, direction)) {
+    return;
+  }
+
+  nextDirection = requestedDirection;
+
+  if (!hasStarted) {
+    startGame();
+  }
+});
+
+restartBtn.addEventListener('click', () => {
+  resetGame();
+  draw();
+});
+
+function startGame() {
+  hasStarted = true;
+  messageEl.textContent = '';
+
+  clearInterval(gameInterval);
+  gameInterval = setInterval(gameLoop, startSpeedMs);
+}
+
+function resetGame() {
+  snake = [
+    { x: 9, y: 10 },
+    { x: 8, y: 10 },
+    { x: 7, y: 10 }
+  ];
+
+  direction = { x: 1, y: 0 };
+  nextDirection = direction;
+  food = spawnFood();
+  score = 0;
+  hasStarted = false;
+
+  scoreEl.textContent = score;
+  messageEl.textContent = 'Druk op een richtingstoets om te starten.';
+
+  clearInterval(gameInterval);
+}
+
+function gameLoop() {
+  direction = nextDirection;
+
+  const head = {
+    x: snake[0].x + direction.x,
+    y: snake[0].y + direction.y
+  };
+
+  if (isCollision(head)) {
+    gameOver();
+    return;
+  }
+
+  snake.unshift(head);
+
+  if (head.x === food.x && head.y === food.y) {
+    score += 1;
+    scoreEl.textContent = score;
+
+    if (score > highscore) {
+      highscore = score;
+      highscoreEl.textContent = highscore;
+      localStorage.setItem('snakeHighscore', String(highscore));
+    }
+
+    food = spawnFood();
+  } else {
+    snake.pop();
+  }
+
+  draw();
+}
+
+function draw() {
+  ctx.fillStyle = '#0f1720';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  drawGrid();
+
+  ctx.fillStyle = '#3aa655';
+  snake.forEach((segment, index) => {
+    const padding = index === 0 ? 1 : 2;
+    ctx.fillRect(
+      segment.x * tileSize + padding,
+      segment.y * tileSize + padding,
+      tileSize - padding * 2,
+      tileSize - padding * 2
+    );
+  });
+
+  ctx.fillStyle = '#ef476f';
+  ctx.fillRect(
+    food.x * tileSize + 2,
+    food.y * tileSize + 2,
+    tileSize - 4,
+    tileSize - 4
+  );
+}
+
+function drawGrid() {
+  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
+  ctx.lineWidth = 1;
+
+  for (let i = 0; i <= gridSize; i += 1) {
+    const pos = i * tileSize;
+
+    ctx.beginPath();
+    ctx.moveTo(pos, 0);
+    ctx.lineTo(pos, canvas.height);
+    ctx.stroke();
+
+    ctx.beginPath();
+    ctx.moveTo(0, pos);
+    ctx.lineTo(canvas.width, pos);
+    ctx.stroke();
+  }
+}
+
+function spawnFood() {
+  let newFood;
+
+  do {
+    newFood = {
+      x: Math.floor(Math.random() * gridSize),
+      y: Math.floor(Math.random() * gridSize)
+    };
+  } while (snake?.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
+
+  return newFood;
+}
+
+function isCollision(head) {
+  const hitWall =
+    head.x < 0 ||
+    head.y < 0 ||
+    head.x >= gridSize ||
+    head.y >= gridSize;
+
+  if (hitWall) {
+    return true;
+  }
+
+  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
+}
+
+function gameOver() {
+  clearInterval(gameInterval);
+  hasStarted = false;
+  messageEl.textContent = `Game over! Eindscore: ${score}. Druk op een richtingstoets om opnieuw te spelen.`;
+
+  const head = snake[0];
+  snake = [
+    { x: head.x, y: head.y },
+    { x: head.x - 1, y: head.y },
+    { x: head.x - 2, y: head.y }
+  ].filter((segment) => segment.x >= 0);
+
+  direction = { x: 1, y: 0 };
+  nextDirection = direction;
+  food = spawnFood();
+  score = 0;
+  scoreEl.textContent = score;
+  draw();
+}
+
+function getDirectionFromKey(key) {
+  switch (key) {
+    case 'arrowup':
+    case 'w':
+      return { x: 0, y: -1 };
+    case 'arrowdown':
+    case 's':
+      return { x: 0, y: 1 };
+    case 'arrowleft':
+    case 'a':
+      return { x: -1, y: 0 };
+    case 'arrowright':
+    case 'd':
+      return { x: 1, y: 0 };
+    default:
+      return null;
+  }
+}
+
+function isReverse(next, current) {
+  return next.x === -current.x && next.y === -current.y;
+}
 
EOF
)
