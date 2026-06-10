/** @type {import('tailwindcss').Config} */
// Colors mirror src/theme/tokens.ts — keep in sync
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#08080A',
          card: '#101014',
          border: '#2A2A32',
        },
        phosphor: {
          DEFAULT: '#4ADE80',
          light: '#16A34A',
        },
        'terminal-cyan': '#22D3EE',
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
