/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  '#388b94',
        secondary:'#52B788',
        accent:   '#F4A261',
        light:    '#D8F3DC',
        dark:     '#1B4332',
        muted:    '#6B7280',
        cream:    '#FAFAF7',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans:  ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
}