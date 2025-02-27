
import { initializeDeck, drawCards } from "./cardAPI.js";

let sum = 0;
let compSum = 0;
let cards = [];
let compCards = [];
let hasBlackJack = false;
let isAlive = false;
let message = "";
let player;

const messageElement = document.getElementById('message-el');
const sumElement = document.getElementById('sum-el');
const cardElement = document.getElementById('playerCardsContainer');
const playerElement = document.getElementById('player-el');
const compSumElement = document.getElementById('compSum-el');
const compCardElement = document.getElementById('compCardsContainer');
const startModal = document.getElementById('start-modal');
const resultModal = document.getElementById('resultModal');

// Updates the DOM with card images and values
const renderCards = (cardsArray, container) => {
    container.innerHTML = '';
    cardsArray.forEach(card => {
        const img = document.createElement('img');
        img.src = card.image;
        img.alt = `${card.value} of ${card.suit}`;
        img.style.height = '150px';
        container.appendChild(img);
    })
}
// Converts the cards to Black Jack values
const getCardValue = (card) => {
    //face cards (KING, QUEEN, JACK) have a value of 10
    if(['KING', 'QUEEN', 'JACK'].includes(card.value)){
        return 10;
    } else if(card.value === 'ACE') {
        return 11;
    } else {
        return parseInt(card.value);
    }
}
// Starts the game
export async function startGame() {
    player = document.getElementById('playerNameInput').value || 'Gambling Glenn';
    isAlive = true;
    hasBlackJack = false;

    //Initialize the deck if needed
    await initializeDeck();

    //Draw the players first two cards
    const playerDraw = await drawCards(2);
    cards = playerDraw;
    sum = cards.reduce((acc, card) => acc + getCardValue(card), 0);

    //Draw the computers first two cards
    const compDraw = await drawCards(2);
    compCards = compDraw;
    compSum = compCards.reduce((acc, card) => acc + getCardValue(card), 0);

    renderGame();
    playerElement.textContent = `${player}'s hand`;
    startModal.classList.add('hidden');
}

//Renders messages and updates cards, sum and state of game
function renderGame() {
    //Render players cards
    renderCards(cards, cardElement);
    sumElement.textContent = `Player sum: ${sum}`;
    //Render computer cards
    renderCards(compCards, compCardElement);
    compSumElement.textContent = `Computer sum: ${compSum}`;

    //Update game message 
    if(sum < 21) {
        message = 'Do you want to draw a new card?';
    } else if (sum === 21) {
        message = 'You´ve got Black Jack!';
        hasBlackJack = true;
    } else if (sum > 21) {
        message = 'You´re out of the game!';
        isAlive = false;
    }

    messageElement.textContent = message;
}

export async function newCard() {
    if(isAlive && !hasBlackJack) {
        const cardDraw = await drawCards(1);
        if(cardDraw.length > 0) {
            const card = cardDraw[0];
            cards.push(card);
            sum += getCardValue(card);
            renderGame();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('newCardBtn').addEventListener('click', newCard);
});


window.startGame = startGame;
window.newCard = newCard;