export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: 'rgb(252, 116, 29)',
          50:  '#fff5ec',
          100: '#ffe7d1',
          200: '#ffc89a',
          300: '#ffa461',
          400: '#ff8536',
          500: 'rgb(252, 116, 29)',
          600: '#e25a10',
          700: '#bb460e',
          800: '#933710',
          900: '#762e11',
        },
      },
      letterSpacing: {
        tightest: '-0.03em',
        'super-tight': '-0.035em',
      },
    },
  },
  plugins: [],
}
