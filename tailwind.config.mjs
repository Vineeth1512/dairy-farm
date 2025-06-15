/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // extend: {
    //   keyframes: {
    //     "fade-in-up": {
    //       "0%": { opacity: 0, transform: "translateY(20px)" },
    //       "100%": { opacity: 1, transform: "translateY(0)" },
    //     },
    //   },
    //   animation: {
    //     "fade-in-up": "fade-in-up 0.8s ease-out both",
    //   },
    // },

    extend: {
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    // Only include exactly these two themes (in this order: first is default)
    themes: ["light", "dark"],
    // If you ever need to override names or provide custom values, you can do:
    // themes: [
    //   {
    //     light: { /* your custom color overrides */ }
    //   },
    //   {
    //     dark: { /* custom dark overrides */ }
    //   }
    // ],
  },
};
