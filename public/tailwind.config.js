
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        navy1: "#07202c",
        cyan1: "#0e3a3f",
        blackish: "#071316",
        teal1: "#124a4f",
        bluish: "#0a2c3b",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #124a4f, #0e3a3f, #07202c, #071316)',
      },
    },
  },
  plugins: [],
}
