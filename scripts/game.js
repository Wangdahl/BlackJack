
import { initializeDeck, drawCards } from "./cardAPI.js";

//Game state object covering all game-related variables
const gameState = {
    deck: [],
    sum: 0,
    compSum: 0,
    cards: [],
    compCards: [],
    hasBlackJack: false,
    compBlackJack: false,
    isAlive: false,
    compAlive: false,
    message: "",
    playerName: "Gambling Glenn",
    startingCash: 100,
    cash: 100,
    bet: 0,
    roundsPlayed: 0,
    roundActive: false
};
//Loading elements into variables
const messageElement = document.getElementById('message-el');
const sumElement = document.getElementById('sum-el');
const cardElement = document.getElementById('playerCardsContainer');
const playerElement = document.getElementById('player-el');
const compSumElement = document.getElementById('compSum-el');
const compCardElement = document.getElementById('compCardsContainer');
const startModal = document.getElementById('start-modal');
const cashInput = document.getElementById('start-cash');
const resultModal = document.getElementById('resultModal');
const resultMessage = document.getElementById('resultMessage');
const betControls = document.getElementById('bet-controls');
const playControls = document.getElementById('play-controls');
const roundControls = document.getElementById('round-controls');
const cashDisplay = document.getElementById('cashDisplay');
const roundDisplay = document.getElementById('round-info');

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
// Functions to display the correct controls
const showBetControls = () => {
    betControls.classList.remove('hidden');
    playControls.classList.add('hidden');
    roundControls.classList.add('hidden');
}
const showPlayControls = () => {
    betControls.classList.add('hidden');
    playControls.classList.remove('hidden');
    roundControls.classList.add('hidden');
}
const showRoundControls = () => {
    betControls.classList.add('hidden');
    playControls.classList.add('hidden');
    roundControls.classList.remove('hidden');
}
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
    cashDisplay.textContent = `Cash: $${gameState.cash}`;
    roundDisplay.textContent = `Rounds Played: ${gameState.roundsPlayed}`;
    if(gameState.sum < 21 && gameState.compSum < 21 && 
        !gameState.hasBlackJack && !gameState.compBlackJack) {
            gameState.message = 'Do you want to draw another card?';
    } 
    messageElement.textContent = gameState.message;
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
    gameState.startingCash = cashInput.value;
    gameState.playerName = document.getElementById('playerNameInput').value || 'Gambling Glenn';
    gameState.isAlive = true;
    gameState.compAlive = true;
    gameState.cash = gameState.startingCash;
    //Initialize the deck
    await initializeDeck();
    
    //Updates the table
    updateUI();
    playerElement.textContent = `${gameState.playerName}'s hand`;
    startModal.classList.add('hidden');
    showBetControls();
};
export function placeBet() {
    const betValue = parseInt(document.getElementById('betInput').value);
    if(betValue > 0 && betValue <= gameState.cash) {
        gameState.bet = betValue;
        gameState.cash -= betValue;
        cashDisplay.textContent = `Cash: $${gameState.cash}`
        startRound();
    } else {
        alert("Invalid bet! Please enter a valid amount up to your available cash.");
    }
}
// Function for starting a new game
export async function startRound() {
    //Reset round specific state
    gameState.sum = 0;
    gameState.compSum = 0;
    gameState.cards = [];
    gameState.compCards = [];
    gameState.hasBlackJack = false;
    gameState.compBlackJack = false;
    gameState.message = "Good luck!";
    gameState.isAlive = true;
    gameState.compAlive = true;
    gameState.roundActive = true;

    //Deal two cards for each player:
    //For player
    const playerDraw = await drawCards(2);
    gameState.cards = playerDraw;
    gameState.sum = calculateHandSum(gameState.cards);
    if (gameState.sum === 21) {
        gameState.hasBlackJack = true;
        gameState.message = "Black Jack!";
        determineWinner();
    }
    //For computer
    const compDraw = await drawCards(2);
    gameState.compCards = compDraw;
    gameState.compSum = calculateHandSum(gameState.compCards);
    if (gameState.compSum === 21) {
        gameState.compBlackJack = true;
        determineWinner();
    }
    //Update UI
    updateUI();
    playerElement.textContent = `${gameState.playerName}'s hand`;
    //Switch to play controls
    showPlayControls();
}
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
                determineWinner();
                updateUI();
            } else if (gameState.sum > 21) {
                determineWinner();
            }
            updateUI();
        }
    }
};
// Draws cards for computer.
export async function compNewCard() {
    if(gameState.isAlive && !gameState.hasBlackJack && 
        gameState.compAlive && !gameState.compBlackJack) {
            //Computer draws card until it´s sum is 17 or more
            while (gameState.compSum < 17) {
                const [card] = await drawCards(1);
                gameState.compCards.push(card);
                gameState.compSum = calculateHandSum(gameState.compCards);
                //Check for Black Jack
                if(gameState.compSum === 21) {
                    gameState.compBlackJack = true;
                    gameState.message = 'Computer has Black Jack, you loose!';
                }
                //Update the UI after each card is drawn.
            }
            updateUI();
    }
}
//Function for doubling bet after seeing two cards.
export async function doubleDown() {
    if(gameState.cash >= gameState.bet) {
        gameState.cash -= gameState.bet;
        gameState.bet *= 2;
        cashDisplay.textContent = `Cash: $${gameState.cash}`
    } else {
        gameState.message = 'Not enough cash to double down!';
        return
    }
    //Draws one more card
    await newCard();
    //Stands automatically
    await hold();
}
export async function hold() {
    // Let computer draw cards
    await compNewCard();
    //Determine round winner
    await determineWinner();
    gameState.roundsPlayed++;
    gameState.roundActive = false;
    //Show end of rounc controls
    showRoundControls();
    updateUI();
}
//Determines the winner of the round.
export function determineWinner() {
    console.log('Determine winner has been called.')
    let resultText = '';
    if (gameState.sum > 21) {
        resultText = 'You busted!';
        gameState.message = resultText;
    } else if (gameState.hasBlackJack) {
        resultText = 'Natural Blackjack! You win.';
        gameState.message = resultText;
    } else if (gameState.compSum > 21) {
        resultText = 'Computer busted! You win.';
        gameState.message = resultText;
    } else if (gameState.compBlackJack) {
        resultText = 'Computer has Black Jack! You lose..';
        gameState.message = resultText;
    } else if (gameState.sum > gameState.compSum) {
        resultText = 'You win!';
        gameState.message = resultText;
    } else if (gameState.compSum > gameState.sum) {
        resultText = 'You lose!';
        gameState.message = resultText;
    } else {
        resultText = 'It\'s a draw! Bet returned.';
        gameState.message = resultText;
    }
    // Process payouts
    if(resultText.includes('win')) {
        if(gameState.hasBlackJack && gameState.cards.length === 2) {
            gameState.cash += Math.floor(gameState.bet * 1.5);
        } else {
            gameState.cash += gameState.bet * 2;
        }
    } else if (resultText.includes('draw')) {
        gameState.cash += gameState.bet;
    }
    messageElement.textContent = gameState.message;
    roundDisplay.textContent = gameState.roundsPlayed;
    cashDisplay.textContent = gameState.cash;
};
// New round function checks for enough cash to continue
export function newRound() {
    if(gameState.cash > 0) {
        resetGameState();
        showBetControls();
        updateUI();
    } else {
        endGame();
    }
}
//End game function
export function endGame() {
    resultModal.classList.remove('hidden');
    if(gameState.cash > 0 && gameState.cash > gameState.startingCash) {
        resultMessage.textContent = `Your total winnings are $${gameState.cash - gameState.startingCash}!`
    } else if (gameState.cash > 0 && gameState.cash < gameState.startingCash) {
        resultMessage.textContent = `Your total loss is $${gameState.cash - gameState.startingCash}...`
    } else {
        resultMessage.textContent = 'You´re out of cash, game over!'
    }
}
//Restarts the game
export function playAgain() {
    //Hide score board and bring up new game board
    resultModal.classList.add('hidden');
    startModal.classList.remove('hidden');
    resetGameState();
    updateUI();
}

// -- Button event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Starting game
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    // In the bet controls:
    document.getElementById('placeBetBtn').addEventListener('click', placeBet);
    
    // In the play controls:
    document.getElementById('hitBtn').addEventListener('click', newCard);
    document.getElementById('standBtn').addEventListener('click', hold);
    document.getElementById('doubleDownBtn').addEventListener('click', doubleDown);
    
    // In the round-end controls:
    document.getElementById('newRoundBtn').addEventListener('click', newRound);
    document.getElementById('endGameBtn').addEventListener('click', endGame);
});



window.startGame = startGame;
window.newCard = newCard;