// src/services/ApiService.js
import questionsLocal from '../data/questions.json';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000';
  }

  async fetchQuestions({ language, difficulty, amount, usedQuestions }) {
    try {
      if (language === 'it') {
        // Gestione domande italiane da file locale
        const availableQuestions = questionsLocal.filter(
          q => q.difficulty === difficulty && !usedQuestions.has(q.question)
        );

        const shuffledQuestions = this.shuffleArray(availableQuestions);
        const selectedQuestions = shuffledQuestions.slice(0, amount);
        selectedQuestions.forEach(q => usedQuestions.add(q.question));
        
        return selectedQuestions.map(q => ({
          ...q,
          options: this.shuffleArray(q.options),
        }));
      } else {
        // Gestione domande inglesi da API
        const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`);
        const data = await response.json();

        if (data.response_code !== 0) {
          throw new Error('Invalid API response');
        }

        return data.results.map(item => ({
          question: item.question,
          options: this.shuffleArray([...item.incorrect_answers, item.correct_answer]),
          correct: item.correct_answer,
          difficulty: difficulty
        }));
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback alle domande locali in caso di errore
      return this.getLocalQuestions({ difficulty, amount, usedQuestions });
    }
  }

  getLocalQuestions({ difficulty, amount, usedQuestions }) {
    const availableQuestions = questionsLocal.filter(
      q => q.difficulty === difficulty && !usedQuestions.has(q.question)
    );

    const shuffledQuestions = this.shuffleArray(availableQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, amount);
    selectedQuestions.forEach(q => usedQuestions.add(q.question));

    return selectedQuestions.map(q => ({
      ...q,
      options: this.shuffleArray(q.options),
    }));
  }

  async fetchLeaderboard() {
    try {
      const response = await fetch(`${this.baseURL}/leaderboard`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  async saveScore(scoreData) {
    try {
      const response = await fetch(`${this.baseURL}/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  }

  shuffleArray(array) {
    return array
      .map(item => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }
}

export default new ApiService();