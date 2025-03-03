# Black Jack Game

A web-based Blackjack game implemented using HTML, CSS, and JavaScript. This project features round-based gameplay with a betting system, multi-deck support, and local deck storage (loaded from the [Deck of Cards API](https://deckofcardsapi.com/)).

## Features

- **Multi-Deck Support:**  
  Users can choose the number of decks used in the game.

- **Betting System:**  
  Place bets before each round; payouts include:
  - **Natural Blackjack (2 cards):** Pays 3:2.
  - **Regular Win:** Pays 1:1.

- **Round-based Gameplay:**  
  The game supports rounds with actions like Hit, Stand, and Double Down.

- **Local Deck Storage:**  
  The full deck is loaded once from the API at the start of the game and stored locally for drawing cards during rounds. This minimizes API calls and avoids rate limits.

- **Responsive UI:**  
  The UI uses dynamic control swapping (betting, playing, round-end) for a smooth game flow.

## File Structure

.
├── index.html         # Main HTML file
├── styles
│   └── styles.css     # CSS styles for the game
├── scripts
│   ├── game.js        # Game logic and state management
│   └── cardAPI.js     # API functions for loading the deck
└── netlify
    └── functions
         └── deck-proxy.js 
## Installation and Running

1. **Clone the repository:**

       git clone https://github.com/yourusername/blackjack-game.git
       cd blackjack-game

2. **Install Dependencies:**

   Ensure you have Node.js installed. Also install the Netlify CLI globally:

       npm install -g netlify-cli

3. **Run Locally with Netlify Functions:**

   Use the Netlify CLI to run your project locally (this simulates your serverless functions):

       netlify dev

   This command starts a local development server (typically at `http://localhost:8888`) that serves both your static files and your Netlify Functions.

4. **Open the Game in Your Browser:**

   Navigate to the URL provided by Netlify CLI (e.g., [http://localhost:8888](http://localhost:8888)).

## How to Play


1. **Start Game:**  
   - On the start screen, enter your name, select the number of decks, and set your starting cash.
   - Click **Start Game** to initialize the game.

2. **Place Your Bet:**  
   - Once the game board loads, use the betting controls to enter your bet.
   - Click **Place Bet** to begin a new round. Your bet is deducted from your cash.

3. **Play Round:**  
   - After your bet, two cards are dealt for both you and the computer.
   - Use **Hit** to draw a new card, **Stand** to end your turn, or **Double Down** to double your bet, get one more card, and automatically stand.

4. **Round End:**  
   - The game will determine the winner, process payouts, and update your cash and rounds played.
   - At the end of a round, choose **New Round** to place another bet or **End Game** to see your final results.

## Development

- **Technologies:**  
  HTML, CSS, JavaScript, Netlify Functions (serverless API proxy)

- **API Handling:**  
  The deck is fetched using a Netlify Function (`deck-proxy`) that combines deck creation and card drawing into one API call. The cardAPI.js module is stateless and solely responsible for this communication, while all deck state (available cards, used cards, deck ID) is managed in game.js. Automatic reshuffle logic is implemented to merge and shuffle used cards back into the deck when 75% of the deck has been played.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.
