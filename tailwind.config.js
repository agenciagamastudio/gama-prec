/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8F9FA',
        'text-primary': '#0A0A0A',
        'text-secondary': '#6B7280',
        'accent': '#00E676',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'border': '#E5E7EB',
      },
    },
  },
  plugins: [],
}
