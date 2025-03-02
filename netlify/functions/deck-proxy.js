// This Netlify function creates a new deck and draws all cards from it.
// It combines both API calls into one and includes a retry mechanism
// to handle temporary errors (such as receiving an HTML error page instead of JSON).

// A helper function that fetches a URL and attempts to parse its response as JSON.
// If the response looks like HTML (starts with "<!DOCTYPE"), it retries the request.
async function fetchJSONWithRetry(url, options, retries = 1, delayMs = 1000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        // Fetch the URL with provided options
        const response = await fetch(url, options);
        // Read the response as text
        const text = await response.text();
        // Check if the response starts with "<!DOCTYPE", indicating HTML (an error page)
        if (text.trim().startsWith('<!DOCTYPE')) {
            if (attempt < retries) {
            // Log a warning and wait before retrying
            console.warn(`Attempt ${attempt + 1} failed; retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
            } else {
            // If we've exhausted retries, throw an error with the raw response
            throw new Error(`Failed after ${retries + 1} attempts. Raw response: ${text}`);
            }
        }
        // Attempt to parse the text as JSON
        try {
            return JSON.parse(text);
        } catch (err) {
            // If parsing fails, throw an error
            throw new Error(`JSON parse error. Raw response: ${text}`);
        }
    }
}

  // The handler function for the Netlify function.
exports.handler = async (event, context) => {
    try {
        // Retrieve the deck count from query parameters; default to 1 if not provided.
        const deckCount = event.queryStringParameters && event.queryStringParameters.deck_count || 1;
        
        // Build the URL to create a new shuffled deck.
        const createUrl = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`;
        
        // Use the helper function to fetch and parse the deck creation response.
        const createData = await fetchJSONWithRetry(createUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, 1, 1000);
        
        // Ensure we received a deck_id from the deck creation response.
        if (!createData.deck_id) {
            throw new Error("No deck_id received from deck creation");
        }
        const deckId = createData.deck_id;
        
        // Calculate the total number of cards based on the deck count.
        const totalCards = deckCount * 52;
        
        // Build the URL to draw all cards from the deck.
        const drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${totalCards}`;
        
        // Use the helper function to fetch and parse the deck draw response.
        const drawData = await fetchJSONWithRetry(drawUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, 1, 1000);
        
        // Check if the draw operation was successful.
        if (!drawData.success) {
            throw new Error("Drawing deck unsuccessful: " + JSON.stringify(drawData));
        }
        
        // Return the deck ID and drawn cards with proper CORS headers.
        return {
            statusCode: 200,
            headers: {
            'Access-Control-Allow-Origin': '*', // Enable cross-origin requests.
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            deck_id: deckId,
            cards: drawData.cards
            })
        };
        
        } catch (error) {
        // Log the error and return an HTTP 500 error response.
        console.error("Error in combined deck-proxy:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
