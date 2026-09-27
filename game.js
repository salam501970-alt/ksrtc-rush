const bus = document.getElementById("bus");
const obstacle = document.getElementById("obstacle");
const coin = document.getElementById("coin");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const distanceText = document.getElementById("distance");
const message = document.getElementById("message");

const road = document.getElementById("road");

let busX = 50;
let score = 0;
let coins = 0;
let distance = 0;

let obstacleY = -100;
let coinY = -100;

let playing = false;
let speed = 5;

function moveBus(direction) {

  if (!playing) return;

  busX += direction * 7;

  if (busX < 20) busX = 20;
  if (busX > 80) busX = 80;

  bus.style.left = busX + "%";
}

document.getElementById("left").addEventListener("touchstart", () => {
  moveBus(-1);
});

document.getElementById("right").addEventListener("touchstart", () => {
  moveBus(1);
});

document.getElementById("left").addEventListener("click", () => {
  moveBus(-1);
});

document.getElementById("right").addEventListener("click", () => {
  moveBus(1);
});

document.addEventListener("keydown", (e) => {

  if (e.key === "ArrowLeft") {
    moveBus(-1);
  }

  if (e.key === "ArrowRight") {
    moveBus(1);
  }

});

function randomObstacle() {

  const lanes = [30, 50, 70];

  const lane = lanes[Math.floor(Math.random() * lanes.length)];

  obstacle.style.left = lane + "%";

  obstacleY = -80;
}

function randomCoin() {

  const lanes = [30, 50, 70];

  const lane = lanes[Math.floor(Math.random() * lanes.length)];

  coin.style.left = lane + "%";

  coinY = -50;
}

function collision(a, b) {

  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

function gameLoop() {

  if (!playing) return;

  obstacleY += speed;
  coinY += speed;

  obstacle.style.top = obstacleY + "px";
  coin.style.top = coinY + "px";

  if (collision(bus, obstacle)) {

    gameOver();
    return;
  }

  if (collision(bus, coin)) {

    coins++;
    score += 50;

    coinsText.textContent = coins;
    scoreText.textContent = score;

    randomCoin();
  }

  if (obstacleY > road.clientHeight) {

    score += 10;
    distance += 5;

    scoreText.textContent = score;
    distanceText.textContent = distance;

    randomObstacle();
  }

  if (coinY > road.clientHeight) {
    randomCoin();
  }

  requestAnimationFrame(gameLoop);
}

function startGame() {

  playing = true;

  score = 0;
  coins = 0;
  distance = 0;

  speed = 5;

  scoreText.textContent = "0";
  coinsText.textContent = "0";
  distanceText.textContent = "0";

  message.textContent = "GO! 🚌";

  randomObstacle();
  randomCoin();

  gameLoop();
}

function gameOver() {

  playing = false;

  message.textContent =
    "💥 Accident! Score: " + score;

  obstacleY = -100;
  coinY = -100;

  obstacle.style.top = "-100px";
  coin.style.top = "-100px";
}

document.getElementById("start").addEventListener("click", startGame);
