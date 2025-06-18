const grid = document.getElementById("grid");
const attemptsDisplay = document.getElementById("attempts");
const timerDisplay = document.getElementById("timer");

let cards = [];
let flipped = [];
let attempts = 0;
let matchedPairs = 0;
let timer = 0;
let interval;

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
    const j = Math.floor(Math.random() * (i + 1)];
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

  shuffle(cardIds).forEach((id, idx) => {
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
        flipped = [];
        matchedPairs++;
        if (matchedPairs === 8) clearInterval(interval);
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

createBoard();
