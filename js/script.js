 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/script.js b/js/script.js
index 85a3ae8729b3f179555c762519b5230623cd6996..41c80c29ef1efdd1d19888c0d7f95e44eeddbce6 100644
--- a/js/script.js
+++ b/js/script.js
@@ -1,2 +1,197 @@
-const app = document.getElementById('app');
-app.innerHTML = `<h2>${artikelen[0].titel}</h2><p>${artikelen[0].tekst}</p>`;
+const canvas = document.getElementById('board');
+const ctx = canvas.getContext('2d');
+
+const scoreEl = document.getElementById('score');
+const highscoreEl = document.getElementById('highscore');
+const statusEl = document.getElementById('status');
+const restartBtn = document.getElementById('restart');
+
+const cells = 24;
+const cellSize = canvas.width / cells;
+const tickMs = 110;
+
+const DIRECTIONS = {
+  ArrowUp: { x: 0, y: -1 },
+  ArrowDown: { x: 0, y: 1 },
+  ArrowLeft: { x: -1, y: 0 },
+  ArrowRight: { x: 1, y: 0 },
+  w: { x: 0, y: -1 },
+  s: { x: 0, y: 1 },
+  a: { x: -1, y: 0 },
+  d: { x: 1, y: 0 }
+};
+
+let snake;
+let direction;
+let queuedDirection;
+let food;
+let score;
+let timerId;
+let running;
+
+let highscore = Number(localStorage.getItem('snake-highscore') || 0);
+highscoreEl.textContent = String(highscore);
+
+initGame();
+draw();
+
+window.addEventListener('keydown', (event) => {
+  const next = DIRECTIONS[event.key] || DIRECTIONS[event.key.toLowerCase()];
+
+  if (!next) {
+    return;
+  }
+
+  event.preventDefault();
+
+  if (isOpposite(next, direction)) {
+    return;
+  }
+
+  queuedDirection = next;
+
+  if (!running) {
+    startLoop();
+  }
+});
+
+restartBtn.addEventListener('click', () => {
+  initGame();
+  draw();
+});
+
+function initGame() {
+  snake = [
+    { x: 12, y: 12 },
+    { x: 11, y: 12 },
+    { x: 10, y: 12 }
+  ];
+  direction = { x: 1, y: 0 };
+  queuedDirection = direction;
+  food = randomFood();
+  score = 0;
+  running = false;
+
+  scoreEl.textContent = '0';
+  statusEl.textContent = 'Druk op een pijltjestoets of WASD om te starten.';
+
+  clearInterval(timerId);
+}
+
+function startLoop() {
+  running = true;
+  statusEl.textContent = '';
+
+  clearInterval(timerId);
+  timerId = setInterval(step, tickMs);
+}
+
+function step() {
+  direction = queuedDirection;
+
+  const nextHead = {
+    x: snake[0].x + direction.x,
+    y: snake[0].y + direction.y
+  };
+
+  if (hitsWall(nextHead) || hitsSelf(nextHead)) {
+    endGame();
+    return;
+  }
+
+  snake.unshift(nextHead);
+
+  if (nextHead.x === food.x && nextHead.y === food.y) {
+    score += 1;
+    scoreEl.textContent = String(score);
+
+    if (score > highscore) {
+      highscore = score;
+      highscoreEl.textContent = String(highscore);
+      localStorage.setItem('snake-highscore', String(highscore));
+    }
+
+    food = randomFood();
+  } else {
+    snake.pop();
+  }
+
+  draw();
+}
+
+function endGame() {
+  clearInterval(timerId);
+  running = false;
+  statusEl.textContent = `Game over. Score: ${score}. Druk op een richtingstoets om opnieuw te spelen.`;
+}
+
+function hitsWall(part) {
+  return part.x < 0 || part.y < 0 || part.x >= cells || part.y >= cells;
+}
+
+function hitsSelf(head) {
+  return snake.some((part) => part.x === head.x && part.y === head.y);
+}
+
+function randomFood() {
+  let position;
+
+  do {
+    position = {
+      x: Math.floor(Math.random() * cells),
+      y: Math.floor(Math.random() * cells)
+    };
+  } while (snake && snake.some((part) => part.x === position.x && part.y === position.y));
+
+  return position;
+}
+
+function draw() {
+  ctx.fillStyle = '#111827';
+  ctx.fillRect(0, 0, canvas.width, canvas.height);
+
+  drawGrid();
+
+  ctx.fillStyle = '#22c55e';
+  for (let i = 0; i < snake.length; i += 1) {
+    const part = snake[i];
+    const inset = i === 0 ? 1 : 2;
+    ctx.fillRect(
+      part.x * cellSize + inset,
+      part.y * cellSize + inset,
+      cellSize - inset * 2,
+      cellSize - inset * 2
+    );
+  }
+
+  ctx.fillStyle = '#ef4444';
+  ctx.fillRect(
+    food.x * cellSize + 2,
+    food.y * cellSize + 2,
+    cellSize - 4,
+    cellSize - 4
+  );
+}
+
+function drawGrid() {
+  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
+  ctx.lineWidth = 1;
+
+  for (let i = 0; i <= cells; i += 1) {
+    const p = i * cellSize;
+
+    ctx.beginPath();
+    ctx.moveTo(p, 0);
+    ctx.lineTo(p, canvas.height);
+    ctx.stroke();
+
+    ctx.beginPath();
+    ctx.moveTo(0, p);
+    ctx.lineTo(canvas.width, p);
+    ctx.stroke();
+  }
+}
+
+function isOpposite(next, current) {
+  return next.x === -current.x && next.y === -current.y;
+}
 
EOF
)
