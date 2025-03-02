
// Helper function for API retries
// API appears unstable, needs fallback options
async function fetchWithRetries(url, options, retries = 3, delayMs = 1000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        const response = await fetch(url, options);
        const text = await response.text();
        if (text.trim().startsWith('<!DOCTYPE')) {
            if (attempt < retries) {
            console.warn(`Attempt ${attempt + 1} failed; retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
            } else {
            throw new Error(`Failed after ${retries + 1} attempts. Raw response: ${text}`);
            }
        }
        try {
            return JSON.parse(text);
        } catch (err) {
            throw new Error(`JSON parse error. Raw response: ${text}`);
        }
    }
}


/*
 * initializeDeck(deckCount)
 * - Calls the Deck of Cards API to create a new deck with the given deckCount.
 * - Draws the entire deck (deckCount * 52 cards) and returns it.
 */
export async function initializeDeck(deckCount = 1) {
    try {
        // Request a new shuffled deck with the specified deck count.
        // Updated to call our Netlify Function proxy, which handles the external API call.
        const data = await fetchWithRetries(`/.netlify/functions/deck-proxy?deck_count=${deckCount}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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


