/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          html: "#E34F26",
          css: "#1572B6",
          javascript: "#F7DF1E",
          react: "#61DAFB",
          angular: "#DD0031",
          bootstrap: "#7952B3",
          figma: "#F24E1E",
          tailwind: "#38B2AC",
          redux: "#764ABC",
        },
      },
    },
    plugins: [],
  }