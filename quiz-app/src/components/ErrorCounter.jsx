// components/ErrorCounter.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ErrorCounter = ({ currentErrors, maxErrors, difficulty }) => {
  const remainingErrors = maxErrors - currentErrors;

  return (
    <div className="flex items-center gap-3 left-7 top-7">
      {[...Array(maxErrors)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            rounded-full 
            ${index >= remainingErrors ? 'bg-red-500' : 'bg-green-500'}
            // Dimensioni responsive: più piccolo su schermi piccoli, più grande su schermi grandi
            w-2 h-2 
            sm:w-3 sm:h-3 
            md:w-4 md:h-4
          `}
        />
      ))}
      <span 
        className="
          text-white/70 ml-2 
          text-xs    // Testo piccolo su schermi molto piccoli
          sm:text-sm // Leggermente più grande su schermi piccoli
          md:text-base // Dimensione base su schermi medi e grandi
        "
      >
        ({remainingErrors} remaining)
      </span>
    </div>
  );
};

export default ErrorCounter;
