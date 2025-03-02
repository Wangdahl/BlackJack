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
        // Updated to call our Netlify Function proxy, which handles the external API call.
        const response = await fetch(`/.netlify/functions/deck-proxy?deck_count=${deckCount}`);
        const data = await response.json();

        if (!data.deck_id || !data.cards) {
            console.error("Error drawing full deck", data);
            throw new Error("Failed to draw full deck");
        }

        localDeck = data.cards;
        return localDeck;
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
