const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

let scoreBoared = document.getElementById("score");

scoreBoared.textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    console.log(cards);
    shuffleCards();
    genCards();
  });

function shuffleCards() {
  let currIndex = cards.length;
  let randomIndex;
  let tempValue;

  while (currIndex > 0) {
    randomIndex = Math.floor(Math.random() * currIndex);
    currIndex -= 1;

    tempValue = cards[currIndex];
    cards[currIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
  }
}

function genCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
    cardsContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
    cardElement.addEventListener("touchstart", flipCard);
  }
}

function flipCard() {
  if (lockBoard) {
    return;
  }
  if (this === firstCard) {
    return;
  }

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  ifMatching();
}

function ifMatching() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    disableCards();
  } else unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("touchstart", flipCard);
  score++;
  scoreBoared.textContent = score;
  if(score === 9){
    startConfetti()
  }
  unlockboard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockboard();
  }, 1000);
}

function unlockboard() {
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function restart() {
  shuffleCards();
  unlockboard();
  score = 0;
  scoreBoared.textContent = score;
  cardsContainer.innerHTML = "";
  genCards();
  stopConfetti()
}
