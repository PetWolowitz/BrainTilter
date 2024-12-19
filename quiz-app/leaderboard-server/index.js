require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Configurazione del server
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({
    origin: 'https://www.purplecoast.it', // Dominio del frontend
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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

        // Ritorna la leaderboard aggiornata
        const leaderboard = await Score.find()
            .sort({ score: -1 })
            .limit(10);

        res.status(201).json(leaderboard);
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        res.status(500).json({ error: 'Errore nel salvataggio del punteggio' });
    }
});

app.delete('/leaderboard/clear', async (req, res) => {
    try {
        await Score.deleteMany({});
        res.status(200).send({ message: 'Tutti i punteggi sono stati eliminati!' });
    } catch (error) {
        res.status(500).send({ error: 'Errore durante la pulizia dei punteggi.' });
    }
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
