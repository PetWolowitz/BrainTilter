import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GameOver = ({ onRestart, score, onSaveScore, topScores = [] }) => {
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onSaveScore({
        name: playerName.toUpperCase(),
        score,
      });
      setHasSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-center font-arcade">
      {/* Titolo Game Over */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[100px] mb-8 text-shadow-title"
        style={{
          color: '#00f7ff',
        }}
      >
        GAME OVER
      </motion.h1>

      {/* Se l'utente non ha inserito il nome */}
      {!hasSubmitted ? (
        <div className="text-center mb-8">
          <p className="text-[40px] mb-4 text-shadow-title" style={{ color: '#ff00ff' }}>
            SCORE: {score}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
              className="w-64 bg-transparent border-b-4 border-[#ff00ff] text-[#ff00ff] 
                       p-4 text-center text-3xl tracking-wider focus:outline-none"
              maxLength={10}
              placeholder="ENTER YOUR NAME"
              autoFocus
            />
            <button
              type="submit"
              className="block w-full text-3xl mt-6 cursor-pointer
                       hover:scale-110 active:scale-95 transition-transform text-shadow-title"
              style={{
                color: '#00f7ff',
              }}
            >
              SUBMIT
            </button>
          </form>
        </div>
      ) : (
        // Se l'utente ha inserito il nome
        <div className="text-center">
          {/* Bottoni per Riprova e Classifica */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={onRestart}
              className="text-3xl cursor-pointer
                       hover:scale-110 active:scale-95 transition-transform text-shadow-title"
              style={{
                color: '#ff00ff',
              }}
            >
              RETRY
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="text-3xl cursor-pointer
                       hover:scale-110 active:scale-95 transition-transform text-shadow-title"
              style={{
                color: '#00f7ff',
              }}
            >
              LEADERBOARD
            </button>
          </div>

          {/* Classifica */}
          {showLeaderboard && (
            <div className="space-y-2">
              <h2 className="text-[40px] mb-6 text-shadow-title" style={{ color: '#ff00ff' }}>
                LEADERBOARD
              </h2>
              {topScores.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-8"
                  style={{
                    color: entry.name === playerName ? '#ff00ff' : '#00f7ff',
                    textShadow: entry.name === playerName
                      ? '0 0 20px rgba(255, 0, 255, 0.8)'
                      : '0 0 20px rgba(0, 247, 255, 0.8)',
                  }}
                >
                  <span className="text-2xl">{entry.name}</span>
                  <span className="text-2xl">{entry.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameOver;
