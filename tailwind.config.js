/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  mode: 'jit',
  purge: ['./src/renderer/**/*.{vue,js,ts,jsx,tsx,html}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#f59e0b',
        secondary: '#ecc94b',
        success: '#50d0a9',
        warning: '#e6c725',
        error: '#e74c3c',
        'rate5-gold': '#ffa502',
        'rate4-purple': '#a17dc3',
        'rate3-blue': '#5796ba'
      },
      boxShadow: {
        // modified color from md
        success:
          '0 4px 6px -1px rgba(80, 208, 169, 0.1), 0 2px 4px -1px rgba(80, 208, 169, 0.06)',
        'success-strong':
          '0 4px 6px -1px rgba(80, 208, 169, 0.25), 0 2px 4px -1px rgba(80, 208, 169, 0.1)',
        warning:
          '0 4px 6px -1px rgba(204, 181, 61, 0.1), 0 2px 4px -1px rgba(204, 181, 61, 0.06)',
        'warning-strong':
          '0 4px 6px -1px rgba(204, 181, 61, 0.25), 0 2px 4px -1px rgba(204, 181, 61, 0.1)',
        error:
          '0 4px 6px -1px rgba(231, 76, 60, 0.1), 0 2px 4px -1px rgba(231, 76, 60, 0.06)',
        'error-strong':
          '0 4px 6px -1px rgba(231, 76, 60, 0.25), 0 2px 4px -1px rgba(231, 76, 60, 0.1)'
      },
      typography: {
        sm: {
          css: {
            ol: {
              listStyle: 'decimal',
              paddingLeft: '40px',
              '&>li': {
                paddingLeft: '0 !important'
              }
            },
            ul: {
              listStyle: 'disc',
              paddingLeft: '40px',
              '&>li': {
                paddingLeft: '0 !important'
              }
            }
          }
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
}
