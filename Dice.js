// Dice.js - handles dice logic
class Dice {
    roll() {
        return Math.floor(Math.random() * 6) + 1;
    }
}
export default Dice;