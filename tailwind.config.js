/* eslint-disable no-undef */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  //darkMode: false,
  theme: {
    extend: {
      colors: {
        red: colors.red,
        orange: colors.orange,
        indigo: colors.indigo,
        violet: colors.violet,
        teal: colors.teal,
        blue: colors.blue,
        yellow: colors.amber
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans]
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem"
      }
    }
  },
  variants: {},
  plugins: [
    //require('@tailwindcss/ui'),
    //require('@tailwindcss/custom-forms')
  ]
};
