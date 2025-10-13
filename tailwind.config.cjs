/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,md,mdx,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: '#050507',
        ink: '#f2f2f7',
        muted: '#a3a3b2',
        cyan: '#00ffff',
        violet: '#8b5cf6',
        ember: '#ff3300'
      },
      boxShadow: {
        glow: '0 0 40px rgba(139, 92, 246, 0.25)',
        glowcyan: '0 0 40px rgba(0, 255, 255, 0.25)'
      }
    }
  },
  plugins: []
};
