/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this if you have TypeScript
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary_green: '#016636',
        primary_green1: '#318653',
        primary_green2: '#54A872',
        primary_green3: '#76CA92',
        primary_green4: '#99EEB4',
        secondary_red: '#FF0000',
        secondary_red1: '#FF6060',
        secondary_red2: '#FAADAD',
        neutral_black: '#2F2F2F',
        neutral_black1: '#7D7D7D',
        neutral_grey: '#C3C3C3',
        backgroung: '#F4F4F4',
        backgroung_white: '#FFFFFF',
        warning: '#FDB022',
        warning1: '#FEC84B',
        warning2: '#FEDF89',  
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Add Poppins font
      },
      fontSize: {
        'heading1': '26pt',
        'heading2': '20pt',
        'heading3': '18pt',
        'paragraph1': '16pt',
        'paragraph2': '14pt',
        'paragraph3': '12pt',
        'caption': '10pt',
      },
    },
  },
  plugins: [],
};
