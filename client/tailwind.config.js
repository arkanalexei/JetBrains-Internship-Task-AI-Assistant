/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },

    fontFamily: {
      fira: ["Fira Sans", "sans-serif"],
      sans: ["Fira Sans", "sans-serif"],
      // serif: ['Merriweather', 'serif'],
    },

    extend: {
      colors: {
        primary: "#da291c",
        transparent: "transparent",
        black: "#313131",
        white: "#FFFFFF",
        overlay: "#08090F",
        red: {
          red1: "#EB2629",
          red2: "#F14545",
          red3: "#C41432",
          redA: "#EA2F2A",
          gradientstart: "#F14545",
          gradientend: "#C41432",
          gradientdarkstart: "#BE0000",
          gradientdarkend: "#710013",
        },
        bg_def: "#f3f4fb",
      },
      borderRadius: {
        dashboard: "50% 16px",
      },
      width: {
        footer: "calc(100% - 32px)",
      },
      boxShadow: {
        ocbc: "0 2px 10px 0px rgb(110 180 230 / 0.4)",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
