import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './components/QuestionCard';
import GameOver from './components/GameOver';
import ErrorCounter from './components/ErrorCounter';
import questionsLocal from './data/questions.json';
import BronzeRookie from './assets/bronze-rookie.svg';
import BronzeMaster from './assets/bronze-master.svg';
import SilverRookie from './assets/silver-rookie.svg';
import SilverMaster from './assets/silver-master.svg';
import GoldRookie from './assets/gold-rookie.svg';
import GoldMaster from './assets/gold-master.svg';
import EliteRookie from './assets/elite-rookie.svg';
import EliteMaster from './assets/elite-master.svg';
import CorrectIcon from './assets/correct.svg';
import WrongIcon from './assets/wrong.svg';
import './App.css';

// Configurazione livelli
const GAME_LEVELS = [
  { id: 1, difficulty: 'easy', level: 1, reward: BronzeRookie, timeLimit: 10, requiredScore: 3, totalQuestions: 5 },
  { id: 2, difficulty: 'easy', level: 2, reward: BronzeMaster, timeLimit: 10, requiredScore: 3, totalQuestions: 5 },
  { id: 3, difficulty: 'medium', level: 1, reward: SilverRookie, timeLimit: 25, requiredScore: 3, totalQuestions: 5 },
  { id: 4, difficulty: 'medium', level: 2, reward: SilverMaster, timeLimit: 25, requiredScore: 3, totalQuestions: 5 },
  { id: 5, difficulty: 'hard', level: 1, reward: GoldRookie, timeLimit: 45, requiredScore: 3, totalQuestions: 5 },
  { id: 6, difficulty: 'hard', level: 2, reward: GoldMaster, timeLimit: 45, requiredScore: 3, totalQuestions: 5 },
  { id: 7, difficulty: 'extreme', level: 1, reward: EliteRookie, timeLimit: 60, requiredScore: 3, totalQuestions: 5 },
  { id: 8, difficulty: 'extreme', level: 2, reward: EliteMaster, timeLimit: 60, requiredScore: 3, totalQuestions: 5 },
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
    extreme: 0,
  });
  const [showGameOver, setShowGameOver] = useState(false);
  const [difficultyScore, setDifficultyScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);

  // Set per le domande già usate
  const usedQuestions = new Set();

  // Funzione per ottenere le informazioni del livello corrente
  const getCurrentLevelInfo = () => GAME_LEVELS[currentLevel - 1];

  // Funzione per caricare le domande
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
            options: shuffleArray(q.options),
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
          difficulty: levelInfo.difficulty,
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

  // Funzione per gestire la risposta
  const handleAnswer = (answer) => {
    // Verifica se ci sono domande valide
    if (!questions[currentQuestion]) {
      console.warn("Domanda non trovata. Possibile problema con il caricamento delle domande.");
      return;
    }
  
    const levelInfo = getCurrentLevelInfo();
    const isCorrect = answer === questions[currentQuestion]?.correct;
  
    // Riproduce il suono
    playSound(isCorrect ? 'success' : 'error');
  
    setTimeout(() => {
      // Aggiorna lo stato solo dopo un timeout per evitare conflitti di rendering
      if (isCorrect) {
        setDifficultyScore((prev) => prev + 1);
        setScore((prev) => prev + 1);
      } else {
        const newErrors = {
          ...errorsPerDifficulty,
          [levelInfo.difficulty]: errorsPerDifficulty[levelInfo.difficulty] + 1,
        };
        setErrorsPerDifficulty(newErrors);
  
        if (newErrors[levelInfo.difficulty] >= 2) {
          // Gioco terminato
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
            ? 'Corretto!'
            : 'Correct!'
          : language === 'it'
          ? 'Sbagliato!'
          : 'Wrong!',
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
                [levelInfo.difficulty]: 0,
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
    }, 0); // Utilizza un timeout di 0ms per spostare l'aggiornamento dello stato fuori dal ciclo di rendering corrente
  };
  
  
  
  // Funzione per ricominciare il quiz
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
      extreme: 0,
    });
    usedQuestions.clear();
    setUnlockedRewards([]);
  };

  // Funzione per cambiare lingua
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'it' ? 'en' : 'it'));
    restartQuiz();
  };

  // Stato per i punteggi migliori
  const [topScores, setTopScores] = useState(() => {
    const saved = localStorage.getItem('leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  // Funzione per salvare il punteggio
  const saveScore = (playerData) => {
    const newScores = [...topScores, playerData]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setTopScores(newScores);
    localStorage.setItem('leaderboard', JSON.stringify(newScores));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-arcade">
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
        className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-custom-purple 
                 text-white hover:bg-custom-purple/80 transition-colors backdrop-blur-sm 
                 font-arcade text-lg shadow-lg border border-white/20 z-50"
      >
        {language === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
      </button>

      <div className="fixed top-4 left-4 px-4 py-2 rounded-lg bg-custom-purple/50 
                    backdrop-blur-sm border border-white/20 z-50">
        <p className="text-white font-arcade">
          {language === 'it' ? 'Livello' : 'Level'} {currentLevel} (
          {getCurrentLevelInfo().difficulty.toUpperCase()})
        </p>
        <ErrorCounter
          currentErrors={errorsPerDifficulty[getCurrentLevelInfo().difficulty]}
          maxErrors={2}
          difficulty={getCurrentLevelInfo().difficulty}
        />
      </div>

      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-6xl font-digital text-white text-shadow-title title-font">
          Brain Tilter
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6">
            <p className="text-white text-lg font-arcade">
              {language === 'it' ? 'Caricamento...' : 'Loading...'}
            </p>
          </div>
        ) : showGameOver ? (
          <GameOver
            difficulty={getCurrentLevelInfo().difficulty}
            score={score}
            language={language}
            onRestart={restartQuiz}
            onSaveScore={saveScore}
            topScores={topScores}
          />
        ) : showLevelComplete ? (
          <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-3xl font-arcade mb-4 text-white">
              {language === 'it' ? 'Livello Completato!' : 'Level Complete!'} 🎉
            </h2>
            <div className="text-4xl mb-4">{getCurrentLevelInfo().reward}</div>
          </div>
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
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed top-1/4 left-1/2 transform -translate-x-1/2"
        >
          <img
            src={showFeedback.type === 'correct' ? CorrectIcon : WrongIcon}
            alt={showFeedback.type}
            className="w-20 h-20"
          />
        </motion.div>
      )}
    </div>
  );
};
export default App;
