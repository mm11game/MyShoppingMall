module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    // extend: {
    //   gridTemplateRows: {
    //     // Simple 8 row grid
    //     8: "repeat(8, minmax(0, 1fr))",
    //     // Complex site-specific row configuration
    //     layout: "100px minmax(50px, 1fr) 50px",
    //   },
    // },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
