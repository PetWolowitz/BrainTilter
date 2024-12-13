// src/__tests__/GameService.test.js
import GameService from '../services/GameService';

describe('GameService', () => {
    describe('processAnswer', () => {
        const mockData = {
            answer: 'correct answer',
            currentQuestion: 0,
            questions: [
                { correct: 'correct answer' }
            ],
            levelInfo: { difficulty: 'easy' },
            errorsPerDifficulty: { easy: 0 },
            language: 'it'
        };
        
        test('should process correct answer', () => {
            const result = GameService.processAnswer(mockData);
            
            expect(result.isCorrect).toBe(true);
            expect(result.difficultyScoreIncrement).toBe(1);
            expect(result.scoreIncrement).toBe(1);
            expect(result.showGameOver).toBe(false);
        });
        
        test('should process wrong answer', () => {
            const wrongData = {
                ...mockData,
                answer: 'wrong answer'
            };
            
            const result = GameService.processAnswer(wrongData);
            
            expect(result.isCorrect).toBe(false);
            expect(result.difficultyScoreIncrement).toBe(0);
            expect(result.scoreIncrement).toBe(0);
            expect(result.newErrors.easy).toBe(1);
        });
        
        test('should trigger game over after 2 errors', () => {
            const dataWithError = {
                ...mockData,
                answer: 'wrong answer',
                errorsPerDifficulty: { easy: 1 }
            };
            
            const result = GameService.processAnswer(dataWithError);
            
            expect(result.showGameOver).toBe(true);
        });
    });
    
    describe('checkLevelCompletion', () => {
        const mockData = {
            currentQuestion: 4,
            questions: new Array(5),
            difficultyScore: 3,
            levelInfo: { requiredScore: 3 },
            currentLevel: 1,
            GAME_LEVELS: new Array(8)
        };
        
        test('should detect level completion with passing score', () => {
            const result = GameService.checkLevelCompletion(mockData);
            
            expect(result.levelCompleted).toBe(true);
            expect(result.hasPassedLevel).toBe(true);
            expect(result.isLastLevel).toBe(false);
        });
        
        test('should detect level completion with failing score', () => {
            const failingData = {
                ...mockData,
                difficultyScore: 2
            };
            
            const result = GameService.checkLevelCompletion(failingData);
            
            expect(result.levelCompleted).toBe(true);
            expect(result.hasPassedLevel).toBe(false);
        });
        
        test('should detect final level victory', () => {
            const finalLevelData = {
                ...mockData,
                currentLevel: 8
            };
            
            const result = GameService.checkLevelCompletion(finalLevelData);
            
            expect(result.isLastLevel).toBe(true);
            expect(result.showVictory).toBe(true);
        });
    });
});