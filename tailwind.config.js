// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Font family using Next.js optimized font
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      inter: ['var(--font-inter)', 'sans-serif'],
    },
    // static hex and css‑var backed palette
    colors: {
      transparent: 'transparent',
      current:     'currentColor',

      // basic
      black: '#000000',
      white: '#ffffff',
      gray: {
        50:  '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
      },

      // brand
      indigo: { 600: '#4f46e5' },
      green:  { 600: '#15803d' },
      blue:   { 600: '#2563eb' },
      red:    { 600: '#dc2626' },

      // CSS‑variable tokens
      background:          'var(--background)',
      foreground:          'var(--foreground)',
      card:                'var(--card)',
      'card-foreground':   'var(--card-foreground)',
      popover:             'var(--popover)',
      'popover-foreground':'var(--popover-foreground)',

      primary:             'var(--primary)',
      'primary-foreground':'var(--primary-foreground)',
      secondary:           'var(--secondary)',
      'secondary-foreground':'var(--secondary-foreground)',

      muted:               'var(--muted)',
      'muted-foreground':  'var(--muted-foreground)',
      accent:              'var(--accent)',
      'accent-foreground': 'var(--accent-foreground)',

      destructive:         'var(--destructive)',
      border:              'var(--border)',
      input:               'var(--input)',
      ring:                'var(--ring)',

      chart1:              'var(--chart-1)',
      chart2:              'var(--chart-2)',
      chart3:              'var(--chart-3)',
      chart4:              'var(--chart-4)',
      chart5:              'var(--chart-5)',

      sidebar:             'var(--sidebar)',
      'sidebar-foreground':'var(--sidebar-foreground)',
      'sidebar-primary':   'var(--sidebar-primary)',
      'sidebar-accent':    'var(--sidebar-accent)',
      'sidebar-border':    'var(--sidebar-border)',
      'sidebar-ring':      'var(--sidebar-ring)',
    },
    extend: {
      animation: {
        'carousel-move': 'carousel-move var(--duration,30s) linear infinite',
        'slide-down':    'slide-down 0.3s ease-out',
        'shimmer':       'shimmer 2s linear infinite',
      },
      keyframes: {
        'carousel-move': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(calc(-50% - var(--carousel-offset,0px)))' },
        },
        'slide-down': {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',       opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
