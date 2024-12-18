import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, options, onAnswer, timeLimit, language }) => {
  const [timeLeft, setTimeLeft] = useState(100);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    let timer = null;
    if (!hasAnswered) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setHasAnswered(true);
            onAnswer(null);
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

  useEffect(() => {
    setHasAnswered(false);
    setTimeLeft(100);
  }, [question]);

  const handleMouseMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    const sensitivity = window.innerWidth < 768 ? 25 : 15;
    const rotateX = (mouseY / (rect.height / 2)) * sensitivity;
    const rotateY = -(mouseX / (rect.width / 2)) * sensitivity;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const handleAnswerClick = (answer) => {
    if (!hasAnswered && timeLeft > 0) {
      setHasAnswered(true);
      onAnswer(answer);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full animate-slideUp">
  <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto perspective-1000">
    <div className="mb-4">
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
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

    <div
      className="relative touch-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        handleMouseMove({
          currentTarget: e.currentTarget,
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        handleMouseMove({
          currentTarget: e.currentTarget,
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
      }}
      onTouchEnd={handleMouseLeave}
    >
      <div
        className="absolute inset-0 rounded-xl bg-black/35 border-2 border-white/30 
                 shadow-lg transition-all duration-300 ease-out"
        style={{
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg)
            scale3d(1.05, 1.05, 1.05)
          `,
          transformOrigin: 'center center',
        }}
      />

      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <h2
          className="text-lg sm:text-xl md:text-2xl font-arcade text-white mb-4 text-center"
          style={{
            textShadow: '2px 2px 0 #000',
            letterSpacing: '0.05em',
          }}
          dangerouslySetInnerHTML={{ __html: question }}
        />

        <div className="space-y-3">
          {options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              className="block w-full px-4 py-3 text-sm sm:text-base md:text-lg font-arcade text-white 
                       bg-custom-purple hover:bg-custom-purple/90 rounded-lg transition-colors
                       border-2 border-white/40 hover:border-white/60 
                       transform hover:scale-105 active:scale-95"
              style={{
                textShadow: '1px 1px 0 #000',
                letterSpacing: '0.05em',
              }}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>

        {timeLeft <= 0 && !hasAnswered && (
          <p className="text-red-500 text-center mt-4 font-arcade">
            {language === 'it' ? 'Tempo Scaduto!' : "Time's Up!"}
          </p>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default QuestionCard;
