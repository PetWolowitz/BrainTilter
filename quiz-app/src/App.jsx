import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionCard from './components/QuestionCard';
import questionsLocal from './data/questions.json';

const App = () => {
  const [language, setLanguage] = useState('it');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        if (language === 'it') {
          setQuestions(questionsLocal);
        } else {
          const response = await axios.get(
            'https://opentdb.com/api.php?amount=10&type=multiple'
          );
          const formattedQuestions = response.data.results.map((item) => ({
            question: item.question,
            options: [...item.incorrect_answers, item.correct_answer].sort(
              () => Math.random() - 0.5
            ),
            correct: item.correct_answer,
          }));
          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestions(questionsLocal);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [language]);

  const handleAnswer = (answer) => {
    if (questions[currentQuestion]?.correct === answer) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setShowResult(false);
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

      {/* Language Button - Posizionato in alto a destra */}
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-custom-purple 
                 text-white hover:bg-custom-purple/80 transition-colors backdrop-blur-sm 
                 font-cyber-rustique text-lg shadow-lg border border-white/20 z-50"
      >
        {language === 'it' ? ' EN' : ' IT'}
      </button>

      {/* Title */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-cyber-book text-white animate-glitch title-font mb-4">
          Brain TIlter
        </h1>
      </div>

      {/* Quiz Content */}
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        {loading ? (
          <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6">
            <p className="text-white text-lg font-cyber-rustique">
              {language === 'it' ? 'Caricamento...' : 'Loading...'}
            </p>
          </div>
        ) : showResult ? (
          <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
            <h2 className="text-3xl font-cyber-rustique mb-4 text-white">
              {language === 'it' ? 'Quiz Completato!' : 'Quiz Complete!'}
            </h2>
            <p className="text-xl mb-6 text-white font-cyber-rustique">
              {language === 'it' 
                ? `Hai risposto correttamente a ${score} su ${questions.length} domande.`
                : `You correctly answered ${score} out of ${questions.length} questions.`}
            </p>
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-custom-purple text-white rounded-lg 
                       hover:bg-custom-purple/80 transition-colors font-cyber-rustique"
            >
              {language === 'it' ? 'Ricomincia' : 'Restart'}
            </button>
          </div>
        ) : questions[currentQuestion] ? (
          <QuestionCard
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            onAnswer={handleAnswer}
          />
        ) : null}
      </div>
    </div>
  );
};

export default App;