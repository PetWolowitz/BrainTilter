const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Configurazione del server
const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/leaderboard'; // Cambia con il tuo URI di MongoDB

// Middleware
app.use(cors());
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connesso a MongoDB'))
  .catch((error) => console.error('Errore di connessione a MongoDB:', error));

// Modello per la leaderboard
const ScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', ScoreSchema);


// Rotte API
app.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Score.find().sort({ score: -1 }).limit(10);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero della leaderboard' });
    }
});

app.post('/leaderboard', async (req, res) => {
    try {
        const { name, score } = req.body;
        if (!name || score === undefined) {
            return res.status(400).json({ error: 'Nome e punteggio sono obbligatori' });
        }
        const newScore = new Score({ name, score });
        await newScore.save();
        res.status(201).json({ message: 'Punteggio salvato con successo' });
    } catch (error) {
        res.status(500).json({ error: 'Errore nel salvataggio del punteggio' });
    }
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
