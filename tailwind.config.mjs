/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
   daisyui: {
    // Only include exactly these two themes (in this order: first is default)
    themes: ['light', 'dark'],
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
}
