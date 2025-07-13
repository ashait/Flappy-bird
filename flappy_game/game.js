const BIRD = document.getElementById('bird');
const SCORE = document.getElementById('score');
const GC = document.getElementById('game-container');
const GO = document.getElementById('game-over');

let birdY, velocity, pipes, score, gameOver;
let restartBtn;

// 🔧 Global speed control (2 = 2x fast)
let speedMultiplier = 1;

function initGame() {
  birdY = GC.clientHeight / 2;
  velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  BIRD.style.top = birdY + 'px';
  SCORE.textContent = score;
  GO.style.display = 'none';

  GC.querySelectorAll('.pipe').forEach(p => p.remove());
  if (restartBtn) restartBtn.remove();

  loop();
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !gameOver) velocity = -8;
});

function loop() {
  if (gameOver) return;

  // 🕒 Apply gravity & position using speedMultiplier
  velocity += 0.5 * speedMultiplier;
  birdY += velocity;
  BIRD.style.top = birdY + 'px';

  // Pipe generation timing & speed
  if (pipes.length === 0 || pipes[pipes.length - 1].x < GC.clientWidth - 200) {
    const x = GC.clientWidth;
    const y = Math.random() * (GC.clientHeight - 120 - 80) + 40;
    pipes.push({ x, y, scored: false });
  }

  pipes = pipes.filter(pipe => {
    pipe.x -= 2 * speedMultiplier; // Pipe moves faster
    if (!pipe.scored && pipe.x + 60 < BIRD.offsetLeft) {
      pipe.scored = true;
      score++;
      SCORE.textContent = score;
    }
    return pipe.x + 60 > 0;
  });

  GC.querySelectorAll('.pipe').forEach(el => el.remove());
  pipes.forEach(pipe => {
    ['top', 'bottom'].forEach(type => {
      const div = document.createElement('div');
      div.classList.add('pipe');
      if (type === 'top') {
        div.style.height = pipe.y + 'px';
        div.style.top = '0';
      } else {
        div.style.height = (GC.clientHeight - pipe.y - 120) + 'px';
        div.style.top = (pipe.y + 120) + 'px';
      }
      div.style.left = pipe.x + 'px';
      GC.appendChild(div);
    });
  });

  // Collision detection
  const bx = BIRD.offsetLeft, by = birdY;
  const bw = BIRD.clientWidth, bh = BIRD.clientHeight;
  GC.querySelectorAll('.pipe').forEach(p => {
    const r = p.getBoundingClientRect();
    const br = GC.getBoundingClientRect();
    const px = r.left - br.left, py = r.top - br.top;
    if (
      bx < px + r.width && bx + bw > px &&
      by < py + r.height && by + bh > py
    ) {
      gameOver = true;
    }
  });

  if (birdY < 0 || birdY + bh > GC.clientHeight) gameOver = true;

  if (gameOver) showRestartButton();
  else setTimeout(loop, (1000 / 30) / speedMultiplier); // Frame delay adjusted
}

function showRestartButton() {
  GO.style.display = 'block';

  restartBtn = document.createElement('button');
  restartBtn.textContent = 'Restart Game';
  restartBtn.id = 'restartBtn';
  GC.appendChild(restartBtn);

  restartBtn.addEventListener('click', initGame);
}

initGame();
