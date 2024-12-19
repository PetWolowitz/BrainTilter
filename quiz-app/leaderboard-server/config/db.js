const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Errore di connessione a MongoDB:', err.message);
        process.exit(1); // Termina il processo in caso di errore
    }
};

module.exports = connectDB;
