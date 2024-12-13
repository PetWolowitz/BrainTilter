// src/services/GameService.js
import AudioManager from './AudioManager';

export class GameService {
    processAnswer({ 
        answer, 
        currentQuestion, 
        questions, 
        levelInfo, 
        errorsPerDifficulty, 
        language 
    }) {
        const isCorrect = answer === questions[currentQuestion]?.correct;
        const result = {
            isCorrect,
            showGameOver: false,
            difficultyScoreIncrement: 0,
            scoreIncrement: 0,
            newErrors: { ...errorsPerDifficulty },
            feedback: {
                type: isCorrect ? 'correct' : 'wrong',
                message: isCorrect
                ? (language === 'it' ? 'Corretto!' : 'Correct!')
                : (language === 'it' ? 'Sbagliato!' : 'Wrong!')
            }
        };
        
        AudioManager.playSound(isCorrect ? 'success' : 'error');
        
        if (isCorrect) {
            result.difficultyScoreIncrement = 1;
            result.scoreIncrement = 1;
        } else {
            result.newErrors[levelInfo.difficulty]++;
            
            if (result.newErrors[levelInfo.difficulty] >= 2) {
                AudioManager.playSound('game-over');
                result.showGameOver = true;
            }
        }
        
        return result;
    }
    
    checkLevelCompletion({
        currentQuestion,
        questions,
        difficultyScore,
        levelInfo,
        currentLevel,
        GAME_LEVELS
    }) {
        if (currentQuestion + 1 >= questions.length) {
            const hasPassedLevel = difficultyScore >= levelInfo.requiredScore;
            const isLastLevel = currentLevel >= GAME_LEVELS.length;
            
            return {
                levelCompleted: true,
                hasPassedLevel,
                isLastLevel,
                showVictory: hasPassedLevel && isLastLevel,
                showResult: !hasPassedLevel || isLastLevel
            };
        }
        
        return {
            levelCompleted: false
        };
    }
}

export default new GameService();