const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const obstaclesContainer = document.getElementById("obstacles-container");
const powerupsContainer = document.getElementById("powerups-container");
const background = document.getElementById("background");

let score = 0;
let level = 1;
let baseSpeed = 4;
let playerTrack = 0;
const tracks = [0, 60, 120]; 
player.style.bottom = tracks[playerTrack] + "px";

let obstacles = [];
let powerups = [];
let maxObstacles = 3;
let powerupChance = 0.01;

function initObstacles() {
  obstacles = [];
  for (let i = 0; i < maxObstacles; i++) {
    createObstacle(300 + i * 150);
  }
}

function createObstacle(xPos = 300) {
  const track = Math.floor(Math.random() * tracks.length);
  const size = Math.max(20, 30 - level);
  const div = document.createElement("div");
  div.classList.add("obstacle");
  div.style.width = size + "px";
  div.style.height = size + "px";
  div.style.left = xPos + "px";
  div.style.bottom = tracks[track] + "px";
  obstaclesContainer.appendChild(div);
  obstacles.push({ x: xPos, track, size, element: div });
}

function createPowerup() {
  const track = Math.floor(Math.random() * tracks.length);
  const xPos = 300 + Math.random() * 300;
  const div = document.createElement("div");
  div.classList.add("powerup");
  div.style.left = xPos + "px";
  div.style.bottom = tracks[track] + "px";
  powerupsContainer.appendChild(div);
  powerups.push({ x: xPos, track, element: div });
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (playerTrack < tracks.length - 1) playerTrack++;
      break;
    case "ArrowDown":
      if (playerTrack > 0) playerTrack--;
      break;
    case "ArrowLeft":
      player.style.left = Math.max(0, parseInt(player.style.left) - 10) + "px";
      break;
    case "ArrowRight":
      player.style.left = Math.min(270, parseInt(player.style.left) + 10) + "px";
      break;
  }
  player.style.bottom = tracks[playerTrack] + "px";
});

function gameLoop() {
  const speed = baseSpeed + level;
  let bgX = parseInt(background.style.left || "0") - speed / 2;
  if (bgX <= -300) bgX = 0;
  background.style.left = bgX + "px";

  obstacles.forEach((obs) => {
    obs.x -= speed;
    if (obs.x < -obs.size) {
      obs.x = 300 + Math.random() * 100;
      obs.track = Math.floor(Math.random() * tracks.length);
      obs.size = Math.max(20, 30 - level);
      score++;
      scoreEl.textContent = score;

      if (score % 5 === 0) {
        level++;
        levelEl.textContent = level;
        maxObstacles = Math.min(6, maxObstacles + 1);
        createObstacle(300 + Math.random() * 100);
        gameContainer.style.backgroundColor = `hsl(${Math.random()*360}, 60%, 80%)`;
      }
    }
    obs.element.style.left = obs.x + "px";
    obs.element.style.bottom = tracks[obs.track] + "px";
    obs.element.style.width = obs.size + "px";
    obs.element.style.height = obs.size + "px";
  });

  if (Math.random() < powerupChance) createPowerup();

  powerups.forEach((p, i) => {
    p.x -= speed;
    p.element.style.left = p.x + "px";
    p.element.style.bottom = tracks[p.track] + "px";

    const playerRect = player.getBoundingClientRect();
    const pRect = p.element.getBoundingClientRect();
    if (!(playerRect.right < pRect.left ||
          playerRect.left > pRect.right ||
          playerRect.bottom < pRect.top ||
          playerRect.top > pRect.bottom)) {
      score += 2;
      scoreEl.textContent = score;
      p.element.remove();
      powerups.splice(i, 1);
    }

    if (p.x < -20) {
      p.element.remove();
      powerups.splice(i, 1);
    }
  });

  const playerRect = player.getBoundingClientRect();
  obstacles.forEach((obs) => {
    const obsRect = obs.element.getBoundingClientRect();
    if (!(playerRect.right < obsRect.left ||
          playerRect.left > obsRect.right ||
          playerRect.bottom < obsRect.top ||
          playerRect.top > obsRect.bottom)) {
      alert(`Game Over! Score: ${score} | Level: ${level}`);
      resetGame();
    }
  });

  requestAnimationFrame(gameLoop);
}

function resetGame() {
  score = 0;
  level = 1;
  scoreEl.textContent = score;
  levelEl.textContent = level;
  playerTrack = 0;
  player.style.bottom = tracks[playerTrack] + "px";
  player.style.left = "50px";
  obstacles.forEach(obs => obs.element.remove());
  powerups.forEach(p => p.element.remove());
  obstacles = [];
  powerups = [];
  baseSpeed = 4;
  maxObstacles = 3;
  initObstacles();
  gameContainer.style.backgroundColor = "#e0f7fa";
}

initObstacles();
gameLoop();