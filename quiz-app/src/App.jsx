import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionCard from './components/QuestionCard';
import questionsLocal from './data/questions.json';

const GAME_LEVELS = [
 { id: 1, difficulty: 'easy', reward: '🥉 Rookie Badge', timeLimit: 10, requiredScore: 5, totalQuestions: 10 },
 { id: 2, difficulty: 'easy', reward: '🎯 Precision Star', timeLimit: 10, requiredScore: 5, totalQuestions: 10 },
 { id: 3, difficulty: 'easy', reward: '⭐ Bronze Star', timeLimit: 10, requiredScore: 5, totalQuestions: 10 },
 { id: 4, difficulty: 'easy', reward: '🏅 Bronze Master', timeLimit: 10, requiredScore: 5, totalQuestions: 10 },
 { id: 5, difficulty: 'medium', reward: '🥈 Silver Badge', timeLimit: 25, requiredScore: 5, totalQuestions: 10 },
 { id: 6, difficulty: 'medium', reward: '⚡ Speed Master', timeLimit: 25, requiredScore: 5, totalQuestions: 10 },
 { id: 7, difficulty: 'medium', reward: '🌟 Silver Star', timeLimit: 25, requiredScore: 5, totalQuestions: 10 },
 { id: 8, difficulty: 'medium', reward: '🏆 Silver Master', timeLimit: 25, requiredScore: 5, totalQuestions: 10 },
 { id: 9, difficulty: 'hard', reward: '💎 Diamond Badge', timeLimit: 45, requiredScore: 5, totalQuestions: 10 },
 { id: 10, difficulty: 'hard', reward: '🎮 Elite Player', timeLimit: 45, requiredScore: 5, totalQuestions: 10 },
 { id: 11, difficulty: 'hard', reward: '👑 Gold Star', timeLimit: 45, requiredScore: 5, totalQuestions: 10 },
 { id: 12, difficulty: 'hard', reward: '🏆 Gold Master', timeLimit: 45, requiredScore: 5, totalQuestions: 10 },
 { id: 13, difficulty: 'extreme', reward: '🌠 Legend Badge', timeLimit: 60, requiredScore: 5, totalQuestions: 10 },
 { id: 14, difficulty: 'extreme', reward: '💫 Ultimate Star', timeLimit: 60, requiredScore: 5, totalQuestions: 10 },
 { id: 15, difficulty: 'extreme', reward: '🏅 Platinum Elite', timeLimit: 60, requiredScore: 5, totalQuestions: 10 },
 { id: 16, difficulty: 'extreme', reward: '👑 Supreme Master', timeLimit: 60, requiredScore: 5, totalQuestions: 10 }
];

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
 const [stats, setStats] = useState({
   correctStreak: 0,
   bestStreak: 0,
   avgResponseTime: 0,
   totalResponses: 0,
   perfectLevels: 0
 });
 const [showFeedback, setShowFeedback] = useState(null);
 const [difficultyScore, setDifficultyScore] = useState(0);
 const [usedQuestions, setUsedQuestions] = useState(new Set());

 const getCurrentLevelInfo = () => GAME_LEVELS[currentLevel - 1];

 const shuffleArray = (array) => {
   const shuffled = [...array];
   for (let i = shuffled.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
   }
   return shuffled;
 };

 const getUniqueQuestions = (allQuestions, count) => {
   const availableQuestions = allQuestions.filter(q => !usedQuestions.has(q.question));
   let selectedQuestions = [];

   if (availableQuestions.length >= count) {
     selectedQuestions = shuffleArray(availableQuestions).slice(0, count);
   } else {
     setUsedQuestions(new Set()); // Reset used questions if we run out
     selectedQuestions = shuffleArray(allQuestions).slice(0, count);
   }

   setUsedQuestions(prev => new Set([...prev, ...selectedQuestions.map(q => q.question)]));
   return selectedQuestions;
 };

 useEffect(() => {
   const loadQuestions = async () => {
     setLoading(true);
     try {
       const levelInfo = getCurrentLevelInfo();
       if (language === 'it') {
         const filteredQuestions = questionsLocal.filter(q => q.difficulty === levelInfo.difficulty);
         const selectedQuestions = getUniqueQuestions(filteredQuestions, levelInfo.totalQuestions)
           .map(q => ({
             ...q,
             options: shuffleArray(q.options) // Mescola le opzioni di ogni domanda
           }));
         setQuestions(selectedQuestions);
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
       console.error('Error loading questions:', error);
       const levelInfo = getCurrentLevelInfo();
       const filteredQuestions = questionsLocal.filter(q => q.difficulty === levelInfo.difficulty);
       const selectedQuestions = getUniqueQuestions(filteredQuestions, levelInfo.totalQuestions)
         .map(q => ({
           ...q,
           options: shuffleArray(q.options)
         }));
       setQuestions(selectedQuestions);
     }
     setLoading(false);
   };

   loadQuestions();
 }, [language, currentLevel]);

 const handleAnswer = (answer, responseTime) => {
  const levelInfo = getCurrentLevelInfo();
  const isCorrect = answer === questions[currentQuestion].correct;
    
  if (isCorrect) {
    setDifficultyScore(prev => prev + 1);
    setScore(prev => prev + 1);
  }

  if (currentQuestion + 1 >= levelInfo.totalQuestions) {
    // Logica per fine livello...
  } else {
    // Aggiorna solo l'indice della domanda
    setTimeout(() => {
      setCurrentQuestion(prev => prev + 1);
    }, 700);
  }

  setTotalQuestionsAnswered(prev => prev + 1);
  setShowFeedback({
    type: isCorrect ? 'correct' : 'wrong',
    message: isCorrect 
      ? (language === 'it' ? 'Corretto! 🎯' : 'Correct! 🎯')
      : (language === 'it' ? 'Sbagliato! 😕' : 'Wrong! 😕')
  });


   setTimeout(() => setShowFeedback(null), 1000);

   if (currentQuestion + 1 >= levelInfo.totalQuestions) {
     if (difficultyScore >= levelInfo.requiredScore) {
       if (!unlockedRewards.includes(levelInfo.reward)) {
         setUnlockedRewards(prev => [...prev, levelInfo.reward]);
       }
       setShowLevelComplete(true);
       
       setTimeout(() => {
         if (currentLevel < GAME_LEVELS.length) {
           setCurrentLevel(prev => prev + 1);
           setDifficultyScore(0);
           setCurrentQuestion(0);
           setShowLevelComplete(false);
         } else {
           setShowResult(true);
         }
       }, 2000);
     } else {
       setShowResult(true);
     }
   } else {
     // Passa alla prossima domanda e mescola le opzioni
     setTimeout(() => {
       setCurrentQuestion(prev => prev + 1);
       setQuestions(prev => {
         const newQuestions = [...prev];
         if (newQuestions[currentQuestion + 1]) {
           newQuestions[currentQuestion + 1] = {
             ...newQuestions[currentQuestion + 1],
             options: shuffleArray([...newQuestions[currentQuestion + 1].options])
           };
         }
         return newQuestions;
       });
     }, 700);
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
   setUnlockedRewards([]);
   setUsedQuestions(new Set());
   setStats({
     correctStreak: 0,
     bestStreak: 0,
     avgResponseTime: 0,
     totalResponses: 0,
     perfectLevels: 0
   });
 };

 const toggleLanguage = () => {
   setLanguage(prev => prev === 'it' ? 'en' : 'it');
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
       className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-custom-purple 
                text-white hover:bg-custom-purple/80 transition-colors backdrop-blur-sm 
                font-cyber text-lg shadow-lg border border-white/20 z-50"
     >
       {language === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
     </button>

     <div className="fixed top-4 left-4 px-4 py-2 rounded-lg bg-custom-purple/50 
                   backdrop-blur-sm border border-white/20 z-50">
       <p className="text-white font-cyber">
         {language === 'it' ? 'Livello' : 'Level'} {currentLevel} 
         ({getCurrentLevelInfo().difficulty.toUpperCase()})
       </p>
       <p className="text-sm text-white/80 font-cyber">
         {language === 'it' ? 'Punteggio' : 'Score'}: {difficultyScore}/{getCurrentLevelInfo().requiredScore}
       </p>
       <p className="text-sm text-white/80 font-cyber">
         {language === 'it' ? 'Domande' : 'Questions'}: {currentQuestion + 1}/{getCurrentLevelInfo().totalQuestions}
       </p>
     </div>

     <div className="fixed top-20 right-4 px-4 py-2 rounded-lg bg-custom-purple/50 
                   backdrop-blur-sm border border-white/20 z-50">
       <p className="text-white font-cyber mb-2">
         {language === 'it' ? 'Ricompense' : 'Rewards'}:
       </p>
       <div className="flex flex-col gap-1">
         {unlockedRewards.map((reward, index) => (
           <div key={index} className="text-lg animate-pulse-glow" title={reward}>
             {reward.split(' ')[0]}
           </div>
         ))}
       </div>
     </div>

     {showFeedback && (
       <div className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 
                       text-2xl font-cyber animate-scale-up py-8
                       ${showFeedback.type === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
         {showFeedback.message}
       </div>
     )}

     <div className="w-full max-w-4xl text-center mb-8">
       <h1 className="text-4xl md:text-6xl font-cyber text-white animate-glitch title-font mb-4">
         Brain Tilter
       </h1>
     </div>

     <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
       {loading ? (
         <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6">
           <p className="text-white text-lg font-cyber">
             {language === 'it' ? 'Caricamento...' : 'Loading...'}
           </p>
         </div>
       ) : showLevelComplete ? (
         <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
           <h2 className="text-3xl font-cyber mb-4 text-white">
             {language === 'it' ? 'Livello Completato!' : 'Level Complete!'} 🎉
           </h2>
           <div className="text-4xl mb-4 animate-bounce">
             {getCurrentLevelInfo().reward}
           </div>
         </div>
       ) : showResult ? (
         <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
           <h2 className="text-3xl font-cyber mb-4 text-white">
             {difficultyScore >= getCurrentLevelInfo().requiredScore ? 
               (language === 'it' ? 'Hai Vinto!' : 'You Won!') : 
               (language === 'it' ? 'Riprova!' : 'Try Again!')}
           </h2>
           <p className="text-xl mb-6 text-white font-cyber">
             {language === 'it' ? 'Punteggio Totale' : 'Total Score'}: {score}
           </p>
           <p className="text-lg mb-6 text-white font-cyber">
             {language === 'it' ? 'Ricompense Ottenute' : 'Rewards Earned'}: {unlockedRewards.length}
           </p>
           <button
             onClick={restartQuiz}
             className="px-6 py-3 bg-custom-purple text-white rounded-lg 
                      hover:bg-custom-purple/80 transition-colors font-cyber"
           >
             {language === 'it' ? 'Ricomincia' : 'Play Again'}
           </button>
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
     </div>
   </div>
 );
};

export default App;