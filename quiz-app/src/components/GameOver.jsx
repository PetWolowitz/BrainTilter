// components/GameOver.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GameOver = ({ onRestart, difficulty, score, language }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="absolute inset-0 bg-custom-purple/20 blur-3xl rounded-full"
          />
          
          <motion.h1
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="text-[120px] font-cyber text-custom-purple mb-8 text-center"
            style={{
              textShadow: `
                0 0 20px #b739d3,
                0 0 40px #b739d3,
                0 0 80px #b739d3
              `
            }}
          >
            GAME OVER
          </motion.h1>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-white text-2xl font-cyber mb-2">
              {language === 'it' ? 'Difficoltà' : 'Difficulty'}: {difficulty}
            </p>
            <p className="text-white text-2xl font-cyber">
              {language === 'it' ? 'Punteggio Finale' : 'Final Score'}: {score}
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRestart}
            className="px-8 py-4 bg-custom-purple text-white rounded-lg font-cyber text-xl
                     hover:bg-custom-purple/80 transition-all mx-auto block"
          >
            {language === 'it' ? 'Riprova' : 'Try Again'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOver;