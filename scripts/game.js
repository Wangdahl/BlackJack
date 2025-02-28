
import { initializeDeck, drawCards } from "./cardAPI.js";

//Game state object covering all game-related variables
const gameState = {
    sum: 0,
    compSum: 0,
    cards: [],
    compCards: [],
    hasBlackJack: false,
    compBlackJack: false,
    isAlive: false,
    compAlive: false,
    message: "",
    playerName: "Gambling Glenn"
};

const messageElement = document.getElementById('message-el');
const sumElement = document.getElementById('sum-el');
const cardElement = document.getElementById('playerCardsContainer');
const playerElement = document.getElementById('player-el');
const compSumElement = document.getElementById('compSum-el');
const compCardElement = document.getElementById('compCardsContainer');
const startModal = document.getElementById('start-modal');
const resultModal = document.getElementById('resultModal');

// ---- HELPER FUNCTIONS ----

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
};
// Calculates the sum of total card value on hand.
const calculateHandSum = (cards) => {
    let sum = 0;
    let aceCount = 0;
    
    cards.forEach(card => {
        if(card.value === 'ACE') {
            sum += 11;
            aceCount++;
        } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
            sum += 10;
        } else {
            sum += parseInt(card.value);
        }
    });

    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount --;
    }

    return sum;
};
//Update the UI based on current game state
const updateUI = () => {
    renderCards(gameState.cards, cardElement);
    renderCards(gameState.compCards, compCardElement);
    sumElement.textContent = `Player sum: ${gameState.sum}`;
    compSumElement.textContent = `Computer sum: ${gameState.compSum}`;

    if(gameState.sum < 21 && gameState.compSum < 21 && 
        !gameState.hasBlackJack && !gameState.compBlackJack) {
            gameState.message = 'Do you want to draw another card?';
    } 
    messageElement.textContent = gameState.message;
    if (gameState.sum > 21 || gameState.compSum > 21 || 
        gameState.hasBlackJack || gameState.compBlackJack) {
            determineWinner();
    }
};

// Reset the game state for a new round
const resetGameState = () => {
    gameState.sum = 0;
    gameState.compSum = 0;
    gameState.cards = [];
    gameState.compCards = [];
    gameState.hasBlackJack = false;
    gameState.compBlackJack = false;
    gameState.isAlive = false;
    gameState.compAlive = false;
    gameState.message = "";
};

// ---- CORE GAME FUNCTIONALITY ----

// Starts the game
export async function startGame() {
    //Reseting to ensure clean start
    resetGameState();
    //Get players name from input
    gameState.playerName = document.getElementById('playerNameInput').value || 'Gambling Glenn';
    gameState.isAlive = true;
    gameState.compAlive = true;

    //Initialize the deck and draw cards
    await initializeDeck();
    //For player
    const playerDraw = await drawCards(2);
    gameState.cards = playerDraw;
    gameState.sum = calculateHandSum(gameState.cards);
    if (gameState.sum === 21) {
        gameState.hasBlackJack = true;
        gameState.message = "Black Jack!";
    }
    //For computer
    const compDraw = await drawCards(2);
    gameState.compCards = compDraw;
    gameState.compSum = calculateHandSum(gameState.compCards);
    if (gameState.compSum === 21) {
        gameState.compBlackJack = true;
    }
    //Updates the table
    updateUI();
    playerElement.textContent = `${gameState.playerName}'s hand`;
    startModal.classList.add('hidden');
};

// Draws new cards
export async function newCard() {
    if(gameState.isAlive && !gameState.hasBlackJack) {
        const cardDraw = await drawCards(1);
        if(cardDraw.length > 0) {
            const card = cardDraw[0];
            gameState.cards.push(card);
            gameState.sum = calculateHandSum(gameState.cards);
            if (gameState.sum === 21) {
                gameState.hasBlackJack = true;
                gameState.message = "Black Jack!";
            }
            updateUI();
        }
    }
};

export function determineWinner() {
    let resultText = '';
    if(gameState.sum > 21) {
        resultText = 'You busted! Computer wins.';
    } else if (gameState.hasBlackJack) {
        resultText = 'You´ve got Black Jack! You win.';
    } else if (gameState.compSum > 21) {
        resultText = 'Computer busted! You win!';
    } else if (gameState.compBlackJack) {
        resultText = 'Computer´s got Black Jack! You lose.'
    } else if (gameState.sum > gameState.compSum) {
        resultText = 'You win!'
    } else if (gameState.compSum > gameState.sum) {
        resultText = 'Computer wins!'
    } else {
        resultText = 'It´s a draw! Usually that means house takes the money..'
    }
    //Setting result text
    document.getElementById('resultMessage').textContent = resultText;
    resultModal.classList.remove('hidden');
};

export function playAgain() {
    //Hide score board and bring up new game board
    resultModal.classList.add('hidden');
    startModal.classList.remove('hidden');
    resetGameState();
    updateUI();
}

// -- Button event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('newCardBtn').addEventListener('click', newCard);
    document.getElementById('holdBtn').addEventListener('click', determineWinner);
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);
});


window.startGame = startGame;
window.newCard = newCard;