// components/ErrorCounter.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ErrorCounter = ({ currentErrors, maxErrors, difficulty }) => {
  const remainingErrors = maxErrors - currentErrors;
  
  return (
    <div className="flex items-center gap-2">
      {[...Array(maxErrors)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-3 h-3 rounded-full ${
            index >= remainingErrors
              ? 'bg-red-500'
              : 'bg-green-500'
          }`}
        />
      ))}
      <span className="text-white/70 text-sm ml-2">
        ({remainingErrors} remaining)
      </span>
    </div>
  );
};

export default ErrorCounter;