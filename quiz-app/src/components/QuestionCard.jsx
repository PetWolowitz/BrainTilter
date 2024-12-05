import React, { useState } from 'react';

const QuestionCard = ({ question, options, onAnswer }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * 35;
    const rotateY = -(mouseX / (rect.width / 2)) * 35;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className="w-full max-w-sm mx-auto perspective-2000 animate-slideUp"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative rounded-xl backdrop-blur-md bg-white/10 p-4 sm:p-6 border border-white/20 
                   shadow-lg transition-all duration-300 ease-out transform-gpu hover:shadow-2xl"
        style={{
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg)
            scale3d(1.02, 1.02, 1.02)
          `,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className="relative"
          style={{
            transform: 'translateZ(50px)',
            transformStyle: 'preserve-3d'
          }}
        >
          <h2 
            className="text-base sm:text-lg v font-cyber-netic text-white mb-4 sm:mb-6 text-center"
            dangerouslySetInnerHTML={{ __html: question }}
          ></h2>
          
          <div className="space-y-2 sm:space-y-3">
            {options?.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswer(option)}
                className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm font-cyber-netic font-medium text-white 
                         bg-custom-purple hover:bg-custom-purple/80 rounded-lg transition-all
                         border border-white/20 shadow-md hover:scale-105
                         transform-gpu hover:shadow-xl"
                dangerouslySetInnerHTML={{ __html: option }}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;





