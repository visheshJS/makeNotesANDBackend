/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{ejs,html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

