const grid = document.getElementById("grid");
const attemptsDisplay = document.getElementById("attempts");
const timerDisplay = document.getElementById("timer");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const startBtn = document.getElementById("startBtn");

let cards = [];
let flipped = [];
let attempts = 0;
let matchedPairs = 0;
let timer = 0;
let interval;

// Audio setup
const bgMusic = new Audio("music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

const flipSound = new Audio("open.mp3");
flipSound.volume = 0.6;

const winSound = new Audio("win.mp3");
winSound.volume = 0.8;

function startTimer() {
  interval = setInterval(() => {
    timer++;
    const mins = String(Math.floor(timer / 60)).padStart(2, '0');
    const secs = String(timer % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  const totalPairs = 8;
  const cardIds = [];
  for (let i = 1; i <= totalPairs; i++) {
    cardIds.push(i);
    cardIds.push(i);
  }

  shuffle(cardIds).forEach((id) => {
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.id = id;
    div.innerHTML = '<span>?</span>';
    div.onclick = () => flipCard(div, id);
    grid.appendChild(div);
    cards.push(div);
  });

  startTimer();
}

function flipCard(card, id) {
  if (flipped.length === 2 || card.classList.contains("disabled")) return;

  flipSound.currentTime = 0;
  flipSound.play();

  card.innerHTML = `<img src="${id}.png" alt="card">`;
  flipped.push({card, id});

  if (flipped.length === 2) {
    attempts++;
    attemptsDisplay.textContent = attempts;
    const [a, b] = flipped;
    if (a.id === b.id && a.card !== b.card) {
      setTimeout(() => {
        a.card.classList.add("disabled");
        b.card.classList.add("disabled");
        a.card.dataset.matched = "true";
        b.card.dataset.matched = "true";
        flipped = [];
        matchedPairs++;
        if (matchedPairs === 8) {
          clearInterval(interval);
          bgMusic.pause();
          winSound.play();
          showResultModal();
          const best = JSON.parse(localStorage.getItem("bestResult") || "null");
          const current = { attempts, time: timer };
          if (!best || current.attempts < best.attempts || (current.attempts === best.attempts && current.time < best.time)) {
            localStorage.setItem("bestResult", JSON.stringify(current));
            const div = document.getElementById("bestResult");
            if (div) {
              const mins = String(Math.floor(timer / 60)).padStart(2, '0');
              const secs = String(timer % 60).padStart(2, '0');
              div.textContent = `Best: ${attempts} attempts | ${mins}:${secs}`;
            }
          }
        }
      }, 500);
    } else {
      setTimeout(() => {
        a.card.innerHTML = "<span>?</span>";
        b.card.innerHTML = "<span>?</span>";
        flipped = [];
      }, 700);
    }
  }
}

document.getElementById("restartBtn").onclick = () => {
  clearInterval(interval);
  grid.innerHTML = "";
  cards = [];
  flipped = [];
  attempts = 0;
  matchedPairs = 0;
  timer = 0;
  timerDisplay.textContent = "00:00";
  attemptsDisplay.textContent = "0";
  createBoard();
};

document.getElementById("backBtn").onclick = () => {
  clearInterval(interval);
  document.getElementById("gameContainer").classList.remove("active");
  document.getElementById("menu").classList.add("active");
  grid.innerHTML = "";
  cards = [];
  flipped = [];
  attempts = 0;
  matchedPairs = 0;
  timer = 0;
  timerDisplay.textContent = "00:00";
  attemptsDisplay.textContent = "0";
};

function showResultModal() {
  const modal = document.getElementById("resultModal");
  const text = document.getElementById("resultText");
  const mins = String(Math.floor(timer / 60)).padStart(2, '0');
  const secs = String(timer % 60).padStart(2, '0');
  text.textContent = `Your result: ${attempts} attempts | ${mins}:${secs}`;
  modal.classList.add("active");
  document.getElementById("resultOk").onclick = () => {
    modal.classList.remove("active");
    document.getElementById("menu").classList.add("active");
    document.getElementById("gameContainer").classList.remove("active");
    grid.innerHTML = "";
    cards = [];
    flipped = [];
    attempts = 0;
    matchedPairs = 0;
    timer = 0;
    timerDisplay.textContent = "00:00";
    attemptsDisplay.textContent = "0";
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const best = JSON.parse(localStorage.getItem("bestResult") || "null");
  const div = document.getElementById("bestResult");
  if (best && div) {
    const mins = String(Math.floor(best.time / 60)).padStart(2, '0');
    const secs = String(best.time % 60).padStart(2, '0');
    div.textContent = `Best: ${best.attempts} attempts | ${mins}:${secs}`;
  }
});

startBtn.onclick = () => {
  menu.classList.remove("active");
  gameContainer.classList.add("active");
  bgMusic.play();
  createBoard();
};


document.getElementById("backBtn").addEventListener("click", () => {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }

  clearInterval(interval);
  document.getElementById("gameContainer").classList.remove("active");
  document.getElementById("menu").classList.add("active");
  grid.innerHTML = "";
  cards = [];
  flipped = [];
  attempts = 0;
  matchedPairs = 0;
  timer = 0;
  timerDisplay.textContent = "00:00";
  attemptsDisplay.textContent = "0";
});
