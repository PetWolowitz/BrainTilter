// server/middleware/security.js
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100 // limite richieste per IP
});

// Validazione score
const validateScore = (req, res, next) => {
    const { score } = req.body;
    const maxPossibleScore = 40;
    
    if (!Number.isInteger(score) || score < 0 || score > maxPossibleScore) {
        return res.status(400).json({ 
            error: 'Invalid score' 
        });
    }
    
    next();
};

// Validazione timestamp
const validateTimestamp = (req, res, next) => {
    const { timestamp } = req.body;
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    
    if (!timestamp || timestamp < fiveMinutesAgo || timestamp > now) {
        return res.status(400).json({ 
            error: 'Invalid timestamp' 
        });
    }
    
    next();
};

// Anti-cheating
const antiCheating = (req, res, next) => {
    const { gameData } = req.body;
    
    if (gameData) {
        const { answers, timestamps } = gameData;
        
        // Verifica sequenza temporale
        if (timestamps) {
            for (let i = 1; i < timestamps.length; i++) {
                if (timestamps[i] - timestamps[i-1] < 500) { // risposta troppo veloce
                    return res.status(400).json({ 
                        error: 'Suspicious activity detected' 
                    });
                }
            }
        }
        
        // Verifica pattern sospetti
        if (answers && answers.length > 0) {
            const identicalAnswers = answers.filter(
                (a, i, arr) => a === arr[0]
            ).length;
            
            if (identicalAnswers === answers.length && answers.length > 3) {
                return res.status(400).json({ 
                    error: 'Suspicious answer pattern' 
                });
            }
        }
    }
    
    next();
};

module.exports = {
    // Configura middleware di sicurezza
    setupSecurity: (app) => {
        // Protezione headers
        app.use(helmet());
        
        // Previeni NoSQL injection
        app.use(mongoSanitize());
        
        // Rate limiting
        app.use('/api/', limiter);
        
        // Validazione richieste score
        app.use('/api/scores', validateScore);
        app.use('/api/scores', validateTimestamp);
        app.use('/api/scores', antiCheating);
        
        // CORS configurazione
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
            res.header('Access-Control-Allow-Methods', 'GET, POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    }
};