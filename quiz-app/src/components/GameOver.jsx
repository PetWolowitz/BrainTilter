import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


// Aggiungiamo useState e useEffect per gestire lo stato del componente
const GameOver = ({ onRestart, score, onSaveScore }) => {
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [topScores, setTopScores] = useState([]); // Stato per i punteggi


  // Funzione per caricare la leaderboard dal server
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/leaderboard'); // Cambiato endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTopScores(data);
    } catch (error) {
      console.error('Errore nel caricamento della leaderboard:', error);
    }
  };
  
  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboard();
    }
  }, [showLeaderboard]);


  // Funzione per gestire l'invio del punteggio
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      try {
        const response = await fetch('http://localhost:5000/leaderboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playerName.toUpperCase(),
            score,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setHasSubmitted(true);
      } catch (error) {
        console.error('Errore nell\'invio del punteggio:', error);
      }
    }
  };
  

  // Resto del componente GameOver
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/85 text-center font-arcade">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{
          opacity: [0, 1, 0.8, 1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          times: [0, 0.3, 0.6, 1],
          repeat: Infinity,
          ease: 'linear',
        }}
        className="text-[100px] mb-8 text-shadow-title font-arcade"
        style={{
          color: '#00f7ff',
        }}
      >
        GAME OVER
      </motion.h1>

      {!hasSubmitted ? (
        <div className="text-center mb-8">
          <p className="text-[40px] mb-4 font-arcade title-font text-shadow-neon" style={{ color: '#ff00ff' }}>
            SCORE: {score}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
              className="w-64 bg-transparent border-b-4 border-[#ff00ff] text-[#ff00ff] 
                       p-4 text-center text-2xl tracking-wider focus:outline-none"
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
        <div className="text-center">
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
                       hover:scale-110 active:scale-95 transition-transform text-shadow-neon font-arcade"
              style={{
                color: '#00f7ff',
              }}
            >
              LEADERBOARD
            </button>
          </div>

          {showLeaderboard && (
            <div className="space-y-4">
              <h2 className="text-[40px] font-arcade mb-6 text-shadow-title" style={{ color: '#ff00ff' }}>
                LEADERBOARD
              </h2>
              {topScores.length > 0 ? (
                topScores.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex justify-between gap-8 px-4 py-2 bg-black/20 rounded-md"
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
                ))
              ) : (
                <p className="text-xl text-[#ff00ff]">No scores available</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameOver;
