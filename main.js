// Game state
let gameState = {
  dice: [1, 2, 3, 4, 5],
  held: [false, false, false, false, false],
  rollsLeft: 3,
  turn: 1,
  scores: {},
  isRolling: false
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  initializeGame();
  attachEventListeners();
});

function initializeGame() {
  gameState = {
      dice: [1, 2, 3, 4, 5],
      held: [false, false, false, false, false],
      rollsLeft: 3,
      turn: 1,
      scores: {},
      isRolling: false
  };
  updateDisplay();
}

function attachEventListeners() {
  // Dice click events
  document.querySelectorAll('.die').forEach(die => {
      die.addEventListener('click', () => toggleHold(parseInt(die.dataset.index)));
  });

  // Roll button
  document.getElementById('rollBtn').addEventListener('click', rollDice);

  // Score rows
  document.querySelectorAll('.score-row').forEach(row => {
      row.addEventListener('click', () => scoreCategory(row.dataset.category));
  });

  // New game button
  document.getElementById('newGameBtn').addEventListener('click', initializeGame);
}

function rollDice() {
  if (gameState.rollsLeft === 0 || gameState.isRolling) return;
  
  gameState.isRolling = true;
  const diceElements = document.querySelectorAll('.die');
  
  // Animation
  diceElements.forEach((die, index) => {
      if (!gameState.held[index]) {
          die.classList.add('rolling');
          gameState.dice[index] = Math.floor(Math.random() * 6) + 1;
      }
  });

  // Update after animation
  setTimeout(() => {
      diceElements.forEach(die => die.classList.remove('rolling'));
      gameState.isRolling = false;
      gameState.rollsLeft--;
      updateDisplay();
      updatePossibleScores();
  }, 500);
}

function toggleHold(index) {
  if (gameState.rollsLeft === 3) return; // Can't hold before first roll
  gameState.held[index] = !gameState.held[index];
  document.querySelectorAll('.die')[index].classList.toggle('held');
}

function updateDisplay() {
  // Update dice
  document.querySelectorAll('.die').forEach((die, index) => {
      die.textContent = gameState.dice[index];
  });

  // Update game info
  document.querySelector('.rolls-left').textContent = gameState.rollsLeft;
  document.querySelector('.turn-counter').textContent = gameState.turn;

  // Update roll button state
  document.getElementById('rollBtn').disabled = gameState.rollsLeft === 0;

  // Show/hide new game button
  document.getElementById('newGameBtn').style.display = gameState.turn > 13 ? 'inline-block' : 'none';
}

function updatePossibleScores() {
  const possibleScores = calculatePossibleScores();
  document.querySelectorAll('.score-row').forEach(row => {
      const category = row.dataset.category;
      if (!gameState.scores[category]) {
          const scoreElement = row.querySelector('.score');
          scoreElement.textContent = possibleScores[category] || '-';
      }
  });
}

function scoreCategory(category) {
  if (gameState.scores[category] !== undefined || gameState.rollsLeft === 3) return;

  const score = calculatePossibleScores()[category];
  gameState.scores[category] = score;

  // Update display
  const row = document.querySelector(`[data-category="${category}"]`);
  row.querySelector('.score').textContent = score;
  row.classList.add('used');

  // Reset for next turn
  gameState.turn++;
  gameState.rollsLeft = 3;
  gameState.held = [false, false, false, false, false];
  document.querySelectorAll('.die').forEach(die => die.classList.remove('held'));

  updateUpperBonus();
  updateTotalScore();
  updateDisplay();

  // Check if game is over
  if (gameState.turn > 13) {
      endGame();
  }
}

function calculatePossibleScores() {
  const counts = getCounts();
  const sum = gameState.dice.reduce((a, b) => a + b, 0);

  return {
      ones: sumOfNumber(1),
      twos: sumOfNumber(2),
      threes: sumOfNumber(3),
      fours: sumOfNumber(4),
      fives: sumOfNumber(5),
      sixes: sumOfNumber(6),
      threeOfAKind: hasCount(3) ? sum : 0,
      fourOfAKind: hasCount(4) ? sum : 0,
      fullHouse: hasFullHouse() ? 25 : 0,
      smallStraight: hasSmallStraight() ? 30 : 0,
      largeStraight: hasLargeStraight() ? 40 : 0,
      yahtzee: hasCount(5) ? 50 : 0,
      chance: sum
  };

  function sumOfNumber(num) {
      return gameState.dice.filter(d => d === num).reduce((a, b) => a + b, 0);
  }

  function getCounts() {
      const counts = {};
      gameState.dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
      return counts;
  }

  function hasCount(n) {
      return Object.values(counts).some(count => count >= n);
  }

  function hasFullHouse() {
      const values = Object.values(counts);
      return values.includes(2) && values.includes(3);
  }

  function hasSmallStraight() {
      const unique = [...new Set(gameState.dice)].sort().join('');
      return unique.includes('1234') || unique.includes('2345') || unique.includes('3456');
  }

  function hasLargeStraight() {
      const unique = [...new Set(gameState.dice)].sort().join('');
      return unique === '12345' || unique === '23456';
  }
}

function updateUpperBonus() {
  const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const upperSum = upperCategories.reduce((sum, category) => sum + (gameState.scores[category] || 0), 0);
  const bonusElement = document.querySelector('.bonus-score');
  bonusElement.textContent = `${upperSum}/63`;
  
  if (upperSum >= 63) {
      gameState.scores.upperBonus = 35;
  }
}

function updateTotalScore() {
  const total = Object.values(gameState.scores).reduce((a, b) => a + b, 0);
  document.getElementById('totalScore').textContent = total;
}

function endGame() {
  const totalScore = Object.values(gameState.scores).reduce((a, b) => a + b, 0);
  alert(`Game Over! Final Score: ${totalScore}`);
  document.getElementById('rollBtn').disabled = true;
  document.getElementById('newGameBtn').style.display = 'inline-block';
}