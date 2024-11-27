const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Enable CORS and static file serving
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Dice rolling endpoint
app.get('/api/roll-dice', (req, res) => {
    try {
        // Generate random values for 5 dice
        const diceValues = Array(5).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
        
        res.json({
            success: true,
            dice: diceValues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to generate dice values'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});