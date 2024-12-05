/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cyber-netic': ['Cyber-Netic', 'sans-serif'],
        'cyber-book': ['Cyber-BoldBook', 'sans-serif'],
      },
      colors: {
        'custom-purple': '#b739d3',
      },
      animation: {
        'slideUp': 'slideUp 0.5s ease-out forwards',
        'glitch': 'glitch 1s cubic-bezier(.25, .46, .45, .94) both',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { 
            transform: 'translateY(100px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        glitch: {
          '0%': {
            transform: 'translate(0)',
            opacity: '0'
          },
          '20%': {
            transform: 'translate(-5px, 5px)',
          },
          '40%': {
            transform: 'translate(-5px, -5px)',
          },
          '60%': {
            transform: 'translate(5px, 5px)',
          },
          '80%': {
            transform: 'translate(5px, -5px)',
          },
          '100%': {
            transform: 'translate(0)',
            opacity: '1'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      }
    },
  },
  plugins: [],
}