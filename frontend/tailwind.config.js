/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        lg: '8rem',
      },
    },
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-light': 'var(--primary-color-light)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
