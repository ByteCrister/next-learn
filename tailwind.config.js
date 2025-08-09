module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#F0F5FF',
                    100: '#D6E4FF',
                    500: '#3366FF',
                    700: '#254EDA',
                },
                accent: {
                    100: '#F9F7FE',
                    500: '#9C7AED',
                },
            },
            boxShadow: {
                '2xl': '0 20px 40px rgba(0,0,0,0.10)',
            },
            transitionProperty: {
                colors: 'background-color, border-color, color, fill, stroke',
                transform: 'transform',
                spacing: 'margin, padding',
            },
            keyframes: {
                'popover-fade': {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
            },
            animation: {
                'popover-fade': 'popover-fade 150ms ease-out forwards',
            },
        },
    },
    plugins: [],
};
