import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './components/QuestionCard';
import GameOver from './components/GameOver';
import ErrorCounter from './components/ErrorCounter';
import questionsLocal from './data/questions.json';

// Configurazione livelli
const GAME_LEVELS = [
  { id: 1, difficulty: 'easy', level: 1, reward: '🥉 Bronze Rookie', timeLimit: 10, requiredScore: 3, totalQuestions: 5 },
  { id: 2, difficulty: 'easy', level: 2, reward: '🎯 Bronze Master', timeLimit: 10, requiredScore: 3, totalQuestions: 5 },
  { id: 3, difficulty: 'medium', level: 1, reward: '🥈 Silver Rookie', timeLimit: 25, requiredScore: 3, totalQuestions: 5 },
  { id: 4, difficulty: 'medium', level: 2, reward: '⚡ Silver Master', timeLimit: 25, requiredScore: 3, totalQuestions: 5 },
  { id: 5, difficulty: 'hard', level: 1, reward: '🏆 Gold Rookie', timeLimit: 45, requiredScore: 3, totalQuestions: 5 },
  { id: 6, difficulty: 'hard', level: 2, reward: '💎 Gold Master', timeLimit: 45, requiredScore: 3, totalQuestions: 5 },
  { id: 7, difficulty: 'extreme', level: 1, reward: '👑 Elite Rookie', timeLimit: 60, requiredScore: 3, totalQuestions: 5 },
  { id: 8, difficulty: 'extreme', level: 2, reward: '🌟 Elite Master', timeLimit: 60, requiredScore: 3, totalQuestions: 5 }
];

// Funzione per gestire gli effetti sonori
const playSound = (soundName) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.volume = 0.5;
  audio.play().catch((error) => console.log('Audio play failed:', error));
};

// Shuffle array con casualità
const shuffleArray = (array) => {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const App = () => {
  // Stati base
  const [language, setLanguage] = useState('it');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [unlockedRewards, setUnlockedRewards] = useState([]);

  const [errorsPerDifficulty, setErrorsPerDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    extreme: 0
  });
  const [showGameOver, setShowGameOver] = useState(false);
  const [difficultyScore, setDifficultyScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);

  const usedQuestions = new Set();

  const getCurrentLevelInfo = () => GAME_LEVELS[currentLevel - 1];

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const levelInfo = getCurrentLevelInfo();

      if (language === 'it') {
        const availableQuestions = questionsLocal.filter(
          (q) => q.difficulty === levelInfo.difficulty && !usedQuestions.has(q.question)
        );

        const shuffledQuestions = shuffleArray(availableQuestions);
        const selectedQuestions = shuffledQuestions.slice(0, levelInfo.totalQuestions);
        selectedQuestions.forEach((q) => usedQuestions.add(q.question));
        setQuestions(
          selectedQuestions.map((q) => ({
            ...q,
            options: shuffleArray(q.options)
          }))
        );
      } else {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=${levelInfo.totalQuestions}&type=multiple`
        );

        const formattedQuestions = response.data.results.map((item) => ({
          question: item.question,
          options: shuffleArray([...item.incorrect_answers, item.correct_answer]),
          correct: item.correct_answer,
          difficulty: levelInfo.difficulty
        }));

        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Errore durante il caricamento delle domande:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [language, currentLevel]);

  const handleAnswer = (answer) => {
    const levelInfo = getCurrentLevelInfo();
    const isCorrect = answer === questions[currentQuestion]?.correct;

    playSound(isCorrect ? 'success' : 'error');

    if (isCorrect) {
      setDifficultyScore((prev) => prev + 1);
      setScore((prev) => prev + 1);
    } else {
      const newErrors = {
        ...errorsPerDifficulty,
        [levelInfo.difficulty]: errorsPerDifficulty[levelInfo.difficulty] + 1
      };
      setErrorsPerDifficulty(newErrors);

      if (newErrors[levelInfo.difficulty] >= 2) {
        playSound('game-over');
        setShowGameOver(true);
        return;
      }
    }

    setTotalQuestionsAnswered((prev) => prev + 1);
    setShowFeedback({
      type: isCorrect ? 'correct' : 'wrong',
      message: isCorrect
        ? language === 'it'
          ? 'Corretto! 🎯'
          : 'Correct! 🎯'
        : language === 'it'
        ? 'Sbagliato! 😕'
        : 'Wrong! 😕'
    });

    setTimeout(() => setShowFeedback(null), 1000);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (difficultyScore >= levelInfo.requiredScore) {
        setShowLevelComplete(true);
        if (!unlockedRewards.includes(levelInfo.reward)) {
          setUnlockedRewards((prev) => [...prev, levelInfo.reward]);
        }

        setTimeout(() => {
          if (currentLevel < GAME_LEVELS.length) {
            setCurrentLevel((prev) => prev + 1);
            setDifficultyScore(0);
            setCurrentQuestion(0);
            setErrorsPerDifficulty((prev) => ({
              ...prev,
              [levelInfo.difficulty]: 0
            }));
            setShowLevelComplete(false);
          } else {
            setShowResult(true);
          }
        }, 2000);
      } else {
        setShowResult(true);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentLevel(1);
    setCurrentQuestion(0);
    setScore(0);
    setDifficultyScore(0);
    setTotalQuestionsAnswered(0);
    setShowResult(false);
    setShowLevelComplete(false);
    setShowGameOver(false);
    setErrorsPerDifficulty({
      easy: 0,
      medium: 0,
      hard: 0,
      extreme: 0
    });
    usedQuestions.clear();
    setUnlockedRewards([]);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'it' ? 'en' : 'it'));
    restartQuiz();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <video
        className="fixed inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        style={{ zIndex: -1 }}
      >
        <source src="/media/background.mp4" type="video/mp4" />
      </video>

      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-custom-purple text-white hover:bg-custom-purple/80 transition-colors backdrop-blur-sm font-cyber text-lg shadow-lg border border-white/20 z-50"
      >
        {language === 'it' ? 'EN' : 'IT'}
      </button>

      <div className="fixed top-4 left-4 px-4 py-2 rounded-lg bg-custom-purple/50 backdrop-blur-sm border border-white/20 z-50">
        <p className="text-white font-cyber">
          {language === 'it' ? 'Livello' : 'Level'} {currentLevel} ({getCurrentLevelInfo().difficulty.toUpperCase()}).
        </p>
        <ErrorCounter
          currentErrors={errorsPerDifficulty[getCurrentLevelInfo().difficulty]}
          maxErrors={2}
          difficulty={getCurrentLevelInfo().difficulty}
        />
      </div>

      <div className="w-full max-w-4xl text-center mb-8">
        <motion.h1
          className="text-4xl md:text-6xl font-cyber text-white animate-glitch title-font mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          Brain Tilter
        </motion.h1>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6"
          >
            <p className="text-white text-lg font-cyber">
              {language === 'it' ? 'Caricamento...' : 'Loading...'}
            </p>
          </motion.div>
        ) : showGameOver ? (
          <GameOver
            difficulty={getCurrentLevelInfo().difficulty}
            score={score}
            language={language}
            onRestart={restartQuiz}
          />
        ) : showLevelComplete ? (
          <motion.div
            key="level-complete"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-3xl font-cyber mb-4 text-white">
              {language === 'it' ? 'Livello Completato!' : 'Level Complete!'} 🎉
            </h2>
            <motion.div
              className="text-4xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {getCurrentLevelInfo().reward}
            </motion.div>
          </motion.div>
        ) : showResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-3xl font-cyber mb-4 text-white">
              {difficultyScore >= getCurrentLevelInfo().requiredScore
                ? language === 'it'
                  ? 'Hai Vinto!'
                  : 'You Won!'
                : language === 'it'
                ? 'Riprova!'
                : 'Try Again!'}
            </h2>
            <p className="text-xl mb-6 text-white font-cyber">
              {language === 'it' ? 'Punteggio Totale' : 'Total Score'}: {score}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartQuiz}
              className="px-6 py-3 bg-custom-purple text-white rounded-lg hover:bg-custom-purple/80 transition-colors font-cyber"
            >
              {language === 'it' ? 'Ricomincia' : 'Play Again'}
            </motion.button>
          </motion.div>
        ) : questions[currentQuestion] ? (
          <QuestionCard
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            onAnswer={handleAnswer}
            timeLimit={getCurrentLevelInfo().timeLimit}
            language={language}
          />
        ) : null}
      </AnimatePresence>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 text-2xl font-cyber ${
            showFeedback.type === 'correct' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {showFeedback.message}
        </motion.div>
      )}
    </div>
  );
};

export default App;
