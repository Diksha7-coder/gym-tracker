/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Forced dark aesthetic
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0b0c10',
          card: '#16181f',
          border: '#242731',
          accent: '#1f222b',
        },
        neon: {
          green: '#39ff14',
          cyan: '#00f5ff',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(57, 255, 20, 0.2), 0 0 10px rgba(57, 255, 20, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(57, 255, 20, 0.6), 0 0 25px rgba(57, 255, 20, 0.3)' }
        }
      }
    },
  },
  plugins: [],
}
