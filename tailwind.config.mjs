/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'media', // Use system preference for dark mode (matches Bootstrap's color-mode-type: media-query)
  theme: {
    extend: {
      colors: {
        // Primary blue (matches Bootstrap's $blue: #337ab7)
        primary: {
          DEFAULT: '#337ab7',
          50: '#f0f7fc',
          100: '#e0eef9',
          200: '#b3d4f0',
          300: '#80b9e6',
          400: '#4d9edc',
          500: '#337ab7',
          600: '#2a6493',
          700: '#204d6f',
          800: '#17364b',
          900: '#0d1f28',
        },
        // Gray scale for text and backgrounds
        gray: {
          50: '#f8f9fa',
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Noto Sans"',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        // Custom fluid typography
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.1875rem)',
        'fluid-h1': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.441rem)',
        'fluid-h2': 'clamp(1.5rem, 1.25rem + 1.25vw, 1.953rem)',
        'fluid-h3': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.563rem)',
        'fluid-h4': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
      },
      lineHeight: {
        relaxed: '1.7',
        snug: '1.3',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.015em',
      },
      spacing: {
        // Custom spacing for better rhythm
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        prose: '65ch',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        lg: '0.5rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 24px rgba(0, 0, 0, 0.15)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover-dark': '0 12px 24px rgba(0, 0, 0, 0.5)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray.900'),
            '--tw-prose-headings': theme('colors.gray.900'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.gray.900'),
            '--tw-prose-code': theme('colors.gray.900'),
            '--tw-prose-pre-bg': theme('colors.gray.100'),
            '--tw-prose-pre-code': theme('colors.gray.900'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            'h1, h2, h3, h4, h5, h6': {
              fontWeight: '700',
              letterSpacing: '-0.015em',
              lineHeight: '1.3',
            },
            a: {
              textDecoration: 'underline',
              textDecorationThickness: '0.08em',
              textUnderlineOffset: '0.15em',
              transition: 'color 0.2s ease-in-out, text-decoration-color 0.2s ease-in-out',
              '&:hover': {
                textDecorationThickness: '0.15em',
              },
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.DEFAULT'),
              borderLeftWidth: '5px',
              backgroundColor: theme('colors.gray.100'),
              padding: '0.75rem 2rem',
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.5em',
              borderRadius: '0.3rem',
              fontSize: '0.9em',
              border: `1px solid ${theme('colors.gray.300')}`,
            },
            'code::before': false,
            'code::after': false,
            pre: {
              backgroundColor: theme('colors.gray.100'),
              padding: '1.25rem',
              borderRadius: theme('borderRadius.DEFAULT'),
              border: `1px solid ${theme('colors.gray.300')}`,
            },
          },
        },
        dark: {
          css: {
            '--tw-prose-body': theme('colors.gray.100'),
            '--tw-prose-headings': theme('colors.gray.100'),
            '--tw-prose-links': theme('colors.primary.400'),
            '--tw-prose-bold': theme('colors.gray.100'),
            '--tw-prose-code': theme('colors.gray.100'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-pre-code': theme('colors.gray.100'),
            '--tw-prose-quote-borders': theme('colors.primary.500'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
