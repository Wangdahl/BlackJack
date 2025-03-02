
/**
 * initializeDeck(deckCount)
 * - Calls the Deck of Cards API to create a new deck with the given deckCount.
 * - Draws the entire deck (deckCount * 52 cards) and returns it.
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

        return { deck_id: data.deck_id, cards: data.cards };
    } catch (error) {
        console.error("Error in initializeDeck:", error);
        throw error;
    }
}


