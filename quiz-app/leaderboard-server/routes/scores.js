const express = require('express');
const Score = require('../models/Score');
const router = express.Router();

// GET: Recupera tutti i punteggi
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Aggiunge un nuovo punteggio
router.post('/', async (req, res) => {
  const { name, score } = req.body;
  const newScore = new Score({ name, score });

  try {
    const savedScore = await newScore.save();
    res.status(201).json(savedScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Elimina tutti i punteggi
router.delete('/clear', async (req, res) => {
  try {
    await Score.deleteMany({});
    res.status(200).send({ message: 'All scores cleared!' });
  } catch (error) {
    res.status(500).send({ error: 'Error clearing scores.' });
  }
});

module.exports = router;
