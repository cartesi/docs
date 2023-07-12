module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Plus Jakarta Sans", "sans-serif"],
    },
    extend: {
      colors: {
        card: "var(--ifm-card-background-color)",
        primary: "var(--ifm-color-primary)",
        secondary: "var(--ifm-color-secondary)",
        gray: {
          DEFAULT: "#1D1C1E",
          50: "#F5F6F6",
          100: "#E8E8EA",
          200: "#CECED1",
          300: "#B4B4B8",
          400: "#9A9A9F",
          500: "#807F87",
          600: "#67666D",
          700: "#4E4E52",
          800: "#363538",
          900: "#1D1C1E",
          950: "#1D1C1E",
        },
      },
    },
  },
  plugins: [],
};
