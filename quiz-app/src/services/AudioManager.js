class AudioManager {
    constructor() {
        this.audioCache = new Map();
        this.backgroundMusic = null;
        this.isSoundEnabled = true;
        this.volumes = {
            background: 0.2,
            correct: 0.3,
            wrong: 0.3,
            'game-over': 0.4,
            'level-up': 0.4,         
            'victory': 0.4           
        };
    }

    preloadAudio() {
        const sounds = {
            'background': '/sounds/background.wav',
            'correct': '/sounds/correct.mp3',
            'wrong': '/sounds/wrong.mp3',
            'game-over': '/sounds/game-over.wav',
            'level-up': '/sounds/level-up.mp3',    // Aggiungi virgola qui
            'victory': '/sounds/victory.mp3'        // Ultima voce senza virgola
        };
        
        for (const [key, path] of Object.entries(sounds)) {
            const audio = new Audio(path);
            if (key === 'background') {
                audio.loop = true;
                audio.volume = this.volumes[key];
                this.backgroundMusic = audio; // Salviamo riferimento specifico per background
            } else {
                audio.volume = this.volumes[key];
            }
            this.audioCache.set(key, audio);
        }
    }
    
    startBackgroundMusic() {
        if (this.isSoundEnabled && this.backgroundMusic) {
            this.backgroundMusic.play().catch(() => {});
        }
    }
    
    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        if (this.backgroundMusic) {
            if (this.isSoundEnabled) {
                this.backgroundMusic.play().catch(() => {});
            } else {
                this.backgroundMusic.pause();
            }
        }
        return this.isSoundEnabled;
    }
    
    playSound(soundName, customVolume = null, delay = 0) {
        if (!this.isSoundEnabled) return;
        
        try {
            const originalAudio = this.audioCache.get(soundName);
            if (originalAudio) {
                setTimeout(() => {
                    const audioClone = originalAudio.cloneNode();
                    audioClone.volume = customVolume || this.volumes[soundName] || 0.3;
                    audioClone.play().catch(() => {});
                    
                    audioClone.onended = () => {
                        audioClone.remove();
                    };
                }, delay);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
    
    playLevelUpSound(level) {
        this.playSound('level-up', null, 500); //   
    }
    cleanup() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
        this.audioCache.clear();
    }
}

export default new AudioManager();