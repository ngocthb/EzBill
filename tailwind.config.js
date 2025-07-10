/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        'bg-default': '#EBFDFE',
        'bg-welcome': '#FFFF',
        'text-title': '#252525',
        'text-button': '#FFFFFF',
        'bg-input': '#9CA3AF',
        'text-secondary': '#6B7280',
      },
    },
  },
  plugins: [],
};
