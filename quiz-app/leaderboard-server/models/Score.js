const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

// Controlla se il modello è già stato definito
const Score = mongoose.models.Score || mongoose.model('Score', scoreSchema);

module.exports = Score;
