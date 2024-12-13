import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AudioManager from './services/AudioManager';
import GameService from './services/GameService';
import ApiService from './services/ApiService';
import SecurityService from './services/SecurityService'
import QuestionCard from './components/QuestionCard';
import GameOver from './components/GameOver';
import ErrorCounter from './components/ErrorCounter';
import Victory from './components/Victory';
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
import SoundOnIcon from './assets/sound-on.svg';
import SoundOffIcon from './assets/sound-off.svg';
import './App.css';


const GAME_LEVELS = [
  { id: 1, difficulty: 'easy', level: 1, reward: BronzeRookie, timeLimit: 10, requiredScore: 3, totalQuestions: 5 },
  { id: 2, difficulty: 'easy', level: 2, reward: BronzeMaster, timeLimit: 10, requiredScore: 3, totalQuestions: 5 },
  { id: 3, difficulty: 'medium', level: 1, reward: SilverRookie, timeLimit: 25, requiredScore: 3, totalQuestions: 5 },
  { id: 4, difficulty: 'medium', level: 2, reward: SilverMaster, timeLimit: 25, requiredScore: 3, totalQuestions: 5 },
  { id: 5, difficulty: 'hard', level: 1, reward: GoldRookie, timeLimit: 45, requiredScore: 3, totalQuestions: 5 },
  { id: 6, difficulty: 'hard', level: 2, reward: GoldMaster, timeLimit: 45, requiredScore: 3, totalQuestions: 5 },
  { id: 7, difficulty: 'extreme', level: 1, reward: EliteRookie, timeLimit: 60, requiredScore: 3, totalQuestions: 5 },
  { id: 8, difficulty: 'extreme', level: 2, reward: EliteMaster, timeLimit: 60, requiredScore: 3, totalQuestions: 5 }
];

const shuffleArray = (array) => {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const App = () => {
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
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [errorsPerDifficulty, setErrorsPerDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    extreme: 0,
  });
  const [showGameOver, setShowGameOver] = useState(false);
  const [difficultyScore, setDifficultyScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [titleKey, setTitleKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false); // Stato per mostrare Victory

  const usedQuestions = new Set();


// gestione audio
  useEffect(() => {
    AudioManager.preloadAudio();
    AudioManager.startBackgroundMusic();
    return () => {
      AudioManager.cleanup();
    };
  }, []);

  const toggleSound = () => {
    const isEnabled = AudioManager.toggleSound();
    setIsSoundEnabled(isEnabled);
  };

  const getCurrentLevelInfo = () => GAME_LEVELS[currentLevel - 1];

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const levelInfo = getCurrentLevelInfo();
      const questions = await ApiService.fetchQuestions({
        language,
        difficulty: levelInfo.difficulty,
        amount: levelInfo.totalQuestions,
        usedQuestions
      });
      
      setQuestions(questions);
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
    if (!questions[currentQuestion]) {
      console.warn("Domanda non trovata.");
      return;
    }
   
    const levelInfo = getCurrentLevelInfo();
   
    setTimeout(() => {
      // Log per vedere i dati in ingresso
      console.log('Input data:', {
        answer,
        currentQuestion,
        questions,
        levelInfo,
        errorsPerDifficulty,
        language
      });
   
      const result = GameService.processAnswer({
        answer,
        currentQuestion,
        questions,
        levelInfo,
        errorsPerDifficulty,
        language
      });
   
      // Log per vedere il risultato 
      console.log('GameService result:', result);
   
      // Aggiorna stati basati sul risultato
      setDifficultyScore(prev => prev + result.difficultyScoreIncrement);
      setScore(prev => prev + result.scoreIncrement);
      setShowFeedback(result.feedback);
      
      if (result.newErrors) {
        setErrorsPerDifficulty(result.newErrors);
      }
   
      if (result.showGameOver) {
        AudioManager.playSound('game-over');
        setShowGameOver(true);
        return;
      }
   
      setTotalQuestionsAnswered(prev => prev + 1);
   
      // Rimuovo feedback dopo 1 secondo
      setTimeout(() => setShowFeedback(null), 1000);
   
      // Controllo se ho altre domande
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Controllo completamento livello
        const levelStatus = GameService.checkLevelCompletion({
          currentQuestion,
          questions,
          difficultyScore,
          levelInfo,
          currentLevel,
          GAME_LEVELS
        });
   
        if (levelStatus.hasPassedLevel) {
          setShowLevelComplete(true);
          if (!unlockedRewards.includes(levelInfo.reward)) {
            setUnlockedRewards(prev => [...prev, levelInfo.reward]);
          }
   
          // Attendo 2 secondi per animazioni
          setTimeout(() => {
            if (!levelStatus.isLastLevel) {
              setCurrentLevel(prev => prev + 1);
              setDifficultyScore(0);
              setCurrentQuestion(0);
              setErrorsPerDifficulty(prev => ({
                ...prev,
                [levelInfo.difficulty]: 0,
              }));
              setShowLevelComplete(false);
            } else {
              setShowVictory(levelStatus.showVictory);
              if (!levelStatus.showVictory) {
                setShowResult(true);
              }
            }
          }, 2000);
        } else {
          setShowResult(true);
        }
      }
    }, 0); // setTimeout principale per permettere l'aggiornamento del DOM
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
    setShowVictory(false); // Resetto anche showVictory
    setErrorsPerDifficulty({
      easy: 0,
      medium: 0,
      hard: 0,
      extreme: 0,
    });
    usedQuestions.clear();
    setUnlockedRewards([]);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'it' ? 'en' : 'it'));
    setTitleKey((prev) => prev + 1);
    restartQuiz();
  };

  const [topScores, setTopScores] = useState(() => {
    const saved = localStorage.getItem('leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  const saveScore = async (playerData) => {
    const validationResult = SecurityService.validateApiRequest({
      name: playerData.name,
      score: playerData.score,
    });
  
    if (!validationResult.isValid) {
      console.error('Invalid data');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationResult.sanitizedData)
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const newScores = await response.json();
      setTopScores(newScores);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-arcade">
      <video
        className="fixed inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        style={{ zIndex: -1, filter: 'brightness(0.8)' }}
      >
        <source src="/media/background.mp4" type="video/mp4" />
      </video>

      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-7 px-4 py-2 rounded-lg bg-custom-purple 
                   text-white hover:bg-custom-purple/80 transition-colors backdrop-blur-sm 
                   text-lg shadow-lg border border-white/20 z-50 font-arcade"
      >
        {language === 'it' ? 'EN' : 'IT'}
      </button>


      <button
        onClick={toggleSound}
        className="fixed bottom-4 left-7 px-4 py-2 rounded-lg bg-custom-purple 
             text-white hover:bg-custom-purple/80 transition-colors backdrop-blur-sm 
             font-arcade text-sm shadow-lg border border-white/20 z-50
             flex items-center gap-2"
      >
        <span className="text-lg">
          <img 
            src={isSoundEnabled ? SoundOffIcon : SoundOnIcon} 
            alt="sound icon" 
            className="w-5 h-5"
          />
        </span>
        <span>{isSoundEnabled ? 'MUTE' : 'UNMUTE'}</span>
      </button>
      

      <div className="fixed top-4 left-7 px-4 py-2 rounded-lg bg-custom-purple/50 
                   backdrop-blur-sm border border-white/20 z-50">
        <p className="text-white font-arcade">
          {language === 'it' ? 'Livello' : 'Level'} {currentLevel} (
          {getCurrentLevelInfo().difficulty.toUpperCase()} )
        </p>
        <ErrorCounter
          currentErrors={errorsPerDifficulty[getCurrentLevelInfo().difficulty]}
          maxErrors={2}
          difficulty={getCurrentLevelInfo().difficulty}
        />
      </div>

      <div className="w-full max-w-4xl text-center mb-8">
        <motion.h1
          key={titleKey}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-digital"
          initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 2, type: 'spring' }}
          style={{ textShadow: '0 0 6px rgba(190, 77, 215, 0.7), 0 0 12px rgba(190, 77, 215, 0.6), 0 0 18px rgba(190, 77, 215, 0.5)', color: '#0cf7d8' }}
        >
          Brain Tilter
        </motion.h1>
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
        ) : showVictory ? (
          <Victory
            onRestart={restartQuiz}
            score={score}
            onSaveScore={saveScore}
          />
        ) : showLevelComplete ? (
          <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-3xl font-arcade mb-4 text-white">
              {language === 'it' ? 'Livello Completato!' : 'Level Complete!'} 🎉
            </h2>
            <img src={getCurrentLevelInfo().reward} alt="Reward" className="mx-auto w-24 h-24" />
          </div>
        ) : questions[currentQuestion] ? (
          <QuestionCard
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            onAnswer={handleAnswer}
            timeLimit={getCurrentLevelInfo().timeLimit}
            language={language}
          />
        ) : showResult ? (
          <GameOver
            difficulty={getCurrentLevelInfo().difficulty}
            score={score}
            language={language}
            onRestart={restartQuiz}
            onSaveScore={saveScore}
            topScores={topScores}
          />
        ) : null}
      </AnimatePresence>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
          }}
          className="fixed top-1/2 left-1/4 transform -translate-x-1/2"
        >
          <img
            src={showFeedback.type === 'correct' ? CorrectIcon : WrongIcon}
            alt={showFeedback.type}
            className="w-[5vw] h-[5vw]"
          />
        </motion.div>
      )}
    </div>
  );
};

export default App;
