const bus = document.getElementById("bus");
const obstacle = document.getElementById("obstacle");
const coin = document.getElementById("coin");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const distanceText = document.getElementById("distance");
const message = document.getElementById("message");
const road = document.getElementById("road");

const lanes = [30, 50, 70];

let currentLane = 1;

let score = 0;
let coins = 0;
let distance = 0;

let obstacleY = -100;
let coinY = -100;

let playing = false;
let speed = 5;

let lastTime = 0;


/* -------------------------
   BUS MOVEMENT
------------------------- */

function moveBus(direction) {

  if (!playing) return;

  currentLane += direction;

  if (currentLane < 0) {
    currentLane = 0;
  }

  if (currentLane > 2) {
    currentLane = 2;
  }

  bus.style.left = lanes[currentLane] + "%";
}


/* -------------------------
   BUTTONS
------------------------- */

document.getElementById("left").addEventListener("click", () => {
  moveBus(-1);
});

document.getElementById("right").addEventListener("click", () => {
  moveBus(1);
});


/* -------------------------
   KEYBOARD
------------------------- */

document.addEventListener("keydown", (event) => {

  if (event.key === "ArrowLeft") {
    moveBus(-1);
  }

  if (event.key === "ArrowRight") {
    moveBus(1);
  }

});


/* -------------------------
   SWIPE CONTROL
------------------------- */

let touchStartX = 0;

road.addEventListener("touchstart", (event) => {

  touchStartX = event.touches[0].clientX;

});


road.addEventListener("touchend", (event) => {

  const touchEndX = event.changedTouches[0].clientX;

  const difference = touchEndX - touchStartX;

  if (Math.abs(difference) < 30) {
    return;
  }

  if (difference > 0) {
    moveBus(1);
  } else {
    moveBus(-1);
  }

});


/* -------------------------
   RANDOM TRAFFIC
------------------------- */

function randomObstacle() {

  const lane =
    Math.floor(Math.random() * 3);

  obstacle.style.left =
    lanes[lane] + "%";

  const vehicles = [
    "🚗",
    "🚕",
    "🚙",
    "🚐",
    "🛻"
  ];

  obstacle.textContent =
    vehicles[
      Math.floor(Math.random() * vehicles.length)
    ];

  obstacleY = -100;
}


/* -------------------------
   RANDOM COIN
------------------------- */

function randomCoin() {

  const lane =
    Math.floor(Math.random() * 3);

  coin.style.left =
    lanes[lane] + "%";

  coinY = -50;
}


/* -------------------------
   COLLISION
------------------------- */

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


/* -------------------------
   GAME LOOP
------------------------- */

function gameLoop(timestamp) {

  if (!playing) {
    return;
  }

  if (!lastTime) {
    lastTime = timestamp;
  }

  const delta =
    (timestamp - lastTime) / 16.67;

  lastTime = timestamp;

  obstacleY += speed * delta;
  coinY += speed * delta;

  obstacle.style.top =
    obstacleY + "px";

  coin.style.top =
    coinY + "px";


  /* CAR COLLISION */

  if (collision(bus, obstacle)) {

    gameOver();
    return;
  }


  /* COIN */

  if (collision(bus, coin)) {

    coins++;

    score += 50;

    coinsText.textContent = coins;
    scoreText.textContent = score;

    randomCoin();
  }


  /* OBSTACLE PASSED */

  if (obstacleY > road.clientHeight) {

    score += 10;

    distance += 5;

    scoreText.textContent = score;

    distanceText.textContent =
      distance;

    /* Increase difficulty */

    if (speed < 12) {
      speed += 0.08;
    }

    randomObstacle();
  }


  /* COIN PASSED */

  if (coinY > road.clientHeight) {

    randomCoin();
  }


  requestAnimationFrame(gameLoop);
}


/* -------------------------
   START GAME
------------------------- */

function startGame() {

  playing = true;

  score = 0;
  coins = 0;
  distance = 0;

  speed = 5;

  currentLane = 1;

  lastTime = 0;

  bus.style.left =
    lanes[currentLane] + "%";

  scoreText.textContent = "0";
  coinsText.textContent = "0";
  distanceText.textContent = "0";

  message.textContent =
    "GO! 🚌";

  randomObstacle();
  randomCoin();

  requestAnimationFrame(gameLoop);
}


/* -------------------------
   GAME OVER
------------------------- */

function gameOver() {

  playing = false;

  message.textContent =
    "💥 Accident! Score: " + score;

  obstacle.style.top = "-100px";
  coin.style.top = "-100px";
}


/* -------------------------
   START BUTTON
------------------------- */

document
  .getElementById("start")
  .addEventListener("click", startGame);
