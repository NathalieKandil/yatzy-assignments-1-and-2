class DiceModule {
    constructor() {
        this.diceValues = Array(5).fill(1);
        this.diceElements = document.querySelectorAll('.die');
        this.rollButton = document.querySelector('button');  // Changed to select the roll button
        this.isRolling = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.rollButton) {
            this.rollButton.addEventListener('click', () => this.rollDice());
            console.log('Roll button event listener added');
        } else {
            console.error('Roll button not found');
        }

        this.diceElements.forEach((die, index) => {
            die.addEventListener('click', () => this.toggleHold(index));
        });
    }

    async rollDice() {
        console.log('Rolling dice...'); // Debug log
        if (this.isRolling) return;
        this.isRolling = true;

        try {
            // Add rolling animation
            this.diceElements.forEach(die => {
                if (!die.classList.contains('held')) {
                    die.classList.add('rolling');
                }
            });

            // Get new dice values from server
            const response = await fetch('http://localhost:3000/api/roll-dice');
            console.log('Server response:', response); // Debug log
            const data = await response.json();
            console.log('Received data:', data); // Debug log

            if (data.success) {
                // Update dice values after animation
                setTimeout(() => {
                    this.diceElements.forEach((die, index) => {
                        if (!die.classList.contains('held')) {
                            die.textContent = data.dice[index];
                            this.diceValues[index] = data.dice[index];
                        }
                        die.classList.remove('rolling');
                    });
                    this.isRolling = false;
                }, 500);
            }
        } catch (error) {
            console.error('Error rolling dice:', error);
            this.diceElements.forEach(die => die.classList.remove('rolling'));
            this.isRolling = false;
        }
    }

    toggleHold(index) {
        if (this.isRolling) return;
        this.diceElements[index].classList.toggle('held');
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DiceModule'); // Debug log
    const diceModule = new DiceModule();
});