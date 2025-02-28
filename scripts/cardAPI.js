// cardAPI.js

// Local variable to store the full deck.
let localDeck = [];

/**
 * initializeDeck(deckCount)
 * - Calls the Deck of Cards API to create a new deck with the given deckCount.
 * - Draws the entire deck (deckCount * 52 cards) and stores it in localDeck.
 * - Returns the localDeck.
 */
export async function initializeDeck(deckCount = 1) {
    try {
        // Request a new shuffled deck with the specified deck count.
        const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`);
        const data = await response.json();
        const deckId = data.deck_id;
        
        // Calculate the total number of cards (deckCount * 52)
        const totalCards = deckCount * 52;
        
        // Draw the entire deck from the API.
        const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${totalCards}`);
        const drawData = await drawResponse.json();
        
        if (drawData.success) {
            localDeck = drawData.cards;
            return localDeck;
            } else {
            console.error("Error drawing full deck", drawData);
            throw new Error("Failed to draw full deck");
        }
    } catch (error) {
        console.error("Error in initializeDeck:", error);
        throw error;
    }
}

/**
 * drawFromLocalDeck(count)
 * - Removes and returns the first 'count' cards from localDeck.
 */
export function drawFromLocalDeck(count = 1) {
    return localDeck.splice(0, count);
}

/**
 * (Optional) getLocalDeck()
 * - Returns the current localDeck (for debugging purposes).
 */
export function getLocalDeck() {
    return localDeck;
}
