javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        primary: "#008EBD",
        "primary-hover": "#0077A3",
        secondary: "#001011",
        "background-light": "#FFFFFF",
        surface: "#FFFFFF",
        "surface-alt": "#F5FAFF",
      },
      fontFamily: {
        heading: ['"Dela Gothic One"', 'cursive'],
        body: ['"Montserrat"', 'sans-serif'],
      },
      backgroundImage: {
        'subtle-pattern': 'radial-gradient(#008EBD 0.5px, transparent 0.5px), radial-gradient(#008EBD 0.5px, #ffffff 0.5px)',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 142, 189, 0.15)',
        'glow': '0 0 20px rgba(0, 142, 189, 0.5)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-up-delay': 'fadeUp 0.8s ease-out 0.2s forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
 tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#6acef6",
                        "nebula": "#001011",
                        "background-light": "#f5f7f8",
                        "background-dark": "#101d22",
                    },
                    fontFamily: {
                        "display": ["Manrope", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.5rem",
                        "lg": "1rem",
                        "xl": "1.5rem",
                        "full": "9999px"
                    },
                    boxShadow: {
                        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                        'glow': '0 0 15px rgba(106, 206, 246, 0.3)',
                    }
                },
            },
        }