const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        "mainColor":"#FFFFFF",
        "mainColorDark":"#0a0a0a", //@0a0a0a
        "mainButtonDark":"#fafafa",
        "secondColor":"#EFEFEF",
        "secondColorDark":"#525252",
        "accentColor":"#445E85", 
        "textColor-main":"#000000",
        "textColor-second":"#707070",
        "textColor-main-dark":"#FFFFFF",
        "textColor-second-dark":"#909090",
      },
      backgroundImage:{
        "gradient-custom-gray": "linear-gradient(to bottom, #5A5A5A,#1b1b1b)",
        "gradient-custom-gray-dark": "linear-gradient(to bottom, #9ca3af,#d1d5db)",
      }
    },
  },
  plugins: [require('daisyui')],
};
