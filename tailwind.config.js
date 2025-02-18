/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#593719",
          "primary-content": "#ffffff",
          secondary: "#f6d860",
          accent: "#97bc56",
          success:'#7EAC2D'
        },
      },
    ],
  }, 
}

