// API from https://deckofcardsapi.com/

let deckId = null;

// Fetches a new deck of cards from the API
export async function initializeDeck() {
    try {
        const response = await fetch ('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        deckId = data.deck_id;
        return deckId;
    } catch (error) {
        console.error('Error intializing deck', error);
    }
}

//Draw a given number of cards from the deck
export async function drawCards(count = 1) {
    try {
        // Making sure there is a deck id available
        if(!deckId) {
            await initializeDeck();
        }
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
        const data = await response.json();

        if(data.success) {
            return data.cards; // Returns an array of card objects
        } else {
            console.error('Error drawing cards', data);
            return [];
        }
    } catch (error) {
        console.error('Error drawing cards', error);
        return [];
    }
}