// src/services/SecurityService.js

class SecurityService {
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/[^a-zA-Z0-9]/g, '') // Rimuove tutto tranne lettere e numeri
            .toUpperCase()
            .trim()
            .slice(0, 10); // Limita lunghezza
    }

    validateScore(score) {
        // Controlla che il punteggio sia plausibile
        const maxPossibleScore = 40; // 8 livelli * 5 domande
        return {
            isValid: score >= 0 && score <= maxPossibleScore && Number.isInteger(score),
            sanitizedScore: Math.min(Math.max(0, Math.floor(score)), maxPossibleScore)
        };
    }

    validateGameProgress(answers, timeStamps) {
        if (!Array.isArray(answers) || !Array.isArray(timeStamps)) return false;

        // Verifica tempi di risposta plausibili
        for (let i = 1; i < timeStamps.length; i++) {
            const timeDiff = timeStamps[i] - timeStamps[i-1];
            if (timeDiff < 500) return false; // Risposte troppo veloci
        }

        return true;
    }

    generateSessionToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    validateApiRequest(request) {
        const { name, score, sessionToken } = request;

        // Validazione base
        if (!name || typeof name !== 'string') return false;
        if (!this.validateScore(score).isValid) return false;

        // Controlli aggiuntivi
        const sanitizedName = this.sanitizeInput(name);
        if (sanitizedName.length < 2) return false;

        return {
            isValid: true,
            sanitizedData: {
                name: sanitizedName,
                score: this.validateScore(score).sanitizedScore,
                timestamp: Date.now()
            }
        };
    }

    createRateLimiter(windowMs = 60000, maxRequests = 10) {
        const requests = new Map();

        return (clientId) => {
            const now = Date.now();
            const clientRequests = requests.get(clientId) || [];

            // Rimuovi richieste vecchie
            const validRequests = clientRequests.filter(
                time => now - time < windowMs
            );

            if (validRequests.length >= maxRequests) {
                return false;
            }

            validRequests.push(now);
            requests.set(clientId, validRequests);
            return true;
        };
    }
}

export default new SecurityService();