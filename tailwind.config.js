/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... other config
  plugins: [
    require("tailwindcss-animate"),
    // @ts-ignore
    function({ addUtilities }) {
      const newUtilities = {
        '.clip-path-shield': {
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        },
        '.clip-path-shield-inner': {
          clipPath: 'polygon(50% 10%, 90% 30%, 90% 70%, 50% 90%, 10% 70%, 10% 30%)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}