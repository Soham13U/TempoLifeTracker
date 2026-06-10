/** @type {import('tailwindcss').Config} */
// Colors mirror src/theme/tokens.ts — keep in sync
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0C0C0E',
          card: '#141416',
          border: '#2E2E32',
        },
        phosphor: {
          DEFAULT: '#C9A86C',
          light: '#A16207',
        },
        'terminal-cyan': '#A8A29E',
      },
      borderRadius: {
        terminal: '6px',
      },
      fontFamily: {
        mono: ['JetBrainsMono_400Regular'],
        'mono-semibold': ['JetBrainsMono_600SemiBold'],
        sans: ['Inter_400Regular'],
        'sans-semibold': ['Inter_600SemiBold'],
      },
    },
  },
  plugins: [],
};
