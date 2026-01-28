/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF7225',
        'brand-black': '#171819',
        'brand-warm-grey': '#D1CAC9',
        'brand-bg': '#F2F4F6',
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '480px',
      },
      boxShadow: {
        'toss': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'toss-sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
