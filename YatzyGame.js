// YatzyGame.js - handles game state
class YatzyGame {
    constructor() {
        this.currentPlayer = 1;
        this.currentRound = 1;
        this.totalScore = 0;
    }

    startNewGame() {
        console.log("Starting a new game");
    }

    endTurn() {
        console.log("Ending turn for player:", this.currentPlayer);
    }

    endGame() {
        console.log("Game Over");
    }
}
export default YatzyGame;