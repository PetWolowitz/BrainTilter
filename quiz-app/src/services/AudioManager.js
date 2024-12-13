// src/services/AudioManager.js
class AudioManager {
    constructor() {
        this.audioCache = new Map();
        this.backgroundMusic = null;
        this.isSoundEnabled = true;
    }
    
    preloadAudio() {
        const sounds = {
            'background': '/sounds/background.wav',
            'success': '/sounds/success.mp3',
            'error': '/sounds/error.mp3',
            'game-over': '/sounds/game-over.wav'
        };
        
        for (const [key, path] of Object.entries(sounds)) {
            const audio = new Audio(path);
            if (key === 'background') {
                audio.loop = true;
                audio.volume = 0.2;
                this.backgroundMusic = audio;
            } else {
                audio.volume = 0.2;
            }
            this.audioCache.set(key, audio);
        }
    }
    
    playSound(soundName) {
        if (!this.isSoundEnabled) return;
        
        try {
            // Clone audio for overlapping sounds
            const originalAudio = this.audioCache.get(soundName);
            if (originalAudio) {
                const audioClone = originalAudio.cloneNode();
                audioClone.volume = 0.2;
                audioClone.play().catch(() => {});
            }
        } catch (error) {
            console.error('Error playing sound:', error);
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
    
    startBackgroundMusic() {
        if (this.isSoundEnabled && this.backgroundMusic) {
            this.backgroundMusic.play().catch(() => {});
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    cleanup() {
        this.stopBackgroundMusic();
        this.audioCache.clear();
    }
}

export default new AudioManager();