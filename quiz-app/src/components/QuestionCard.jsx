import React, { useState, useEffect } from 'react';
const QuestionCard = ({ question, options, onAnswer, timeLimit, language }) => {
  const [timeLeft, setTimeLeft] = useState(100);
  const [startTime] = useState(Date.now());
  const [hasAnswered, setHasAnswered] = useState(false); // Nuovo stato per tracciare se è già stata data una risposta

  useEffect(() => {
    let timer = null;
    if (!hasAnswered) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0 && !hasAnswered) {
            clearInterval(timer);
            setHasAnswered(true);
            onAnswer(null); // Invia una sola risposta quando il tempo scade
            return 0;
          }
          return Math.max(0, prev - (100 / (timeLimit * 10)));
        });
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [question, timeLimit, hasAnswered]);

  // Reset hasAnswered quando cambia la domanda
  useEffect(() => {
    setHasAnswered(false);
    setTimeLeft(100);
  }, [question]);

  const handleAnswerClick = (answer) => {
    if (!hasAnswered && timeLeft > 0) {
      setHasAnswered(true);
      const responseTime = Date.now() - startTime;
      onAnswer(answer, responseTime);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto perspective-2000 animate-slideUp">
      <div className="mb-4">
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              timeLeft > 60 ? 'bg-green-500' :
              timeLeft > 30 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${timeLeft}%` }}
          />
        </div>
      </div>
      
      <div className="relative">
        <div 
          className="relative rounded-xl backdrop-blur-md bg-white/10 border border-white/20 
                   shadow-lg transition-all duration-300 ease-out p-4 sm:p-6"
        >
          <h2 
            className="text-base sm:text-lg font-cyber text-white mb-4 sm:mb-6 text-center"
            dangerouslySetInnerHTML={{ __html: question }}
          />
          <div className="space-y-2 sm:space-y-3">
            {options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={hasAnswered || timeLeft <= 0}
                className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm font-cyber text-white 
                         bg-custom-purple hover:bg-custom-purple/80 rounded-lg transition-all
                         border border-white/20 shadow-md hover:scale-105 transform-gpu
                         disabled:opacity-50 disabled:cursor-not-allowed"
                dangerouslySetInnerHTML={{ __html: option }}
              />
            ))}
          </div>
          {timeLeft <= 0 && !hasAnswered && (
            <p className="text-red-500 text-center mt-4 font-cyber">
              {language === 'it' ? 'Tempo Scaduto!' : 'Time\'s Up!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;