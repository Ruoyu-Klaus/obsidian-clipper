/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        darkPurple: "#443C93",
        lightPurple: "#A9A2E8",
        pink: "#F6D2D2",
        darkBlue: "#121826",
        darkGrey: "#212936",
        lightGrey: "#212936"
      }
    }
  },
  plugins: []
}
