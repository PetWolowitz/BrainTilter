const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/leaderboard'); // Forza l'uso di IPv4
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Errore di connessione a MongoDB:', err.message);
    process.exit(1); // Termina il processo in caso di errore
  }
};

module.exports = connectDB;
