import { Components, PaletteOptions, ThemeOptions } from '@mui/material';
import { TypographyStyleOptions } from '@mui/material/styles/createTypography';
import '@fontsource/saira/400.css';
import '@fontsource/saira/500.css';
import '@fontsource/saira/600.css';
import '@fontsource/saira/700.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/700.css';

const typography: TypographyStyleOptions = {
    fontFamily: 'Noto Sans, sans-serif',
    h1: {
        fontFamily: 'Saira, sans-serif',
        fontWeight: 600,
        fontSize: '2.25rem',
        lineHeight: 1.167,
        letterSpacing: 0,
    },
    h2: {
        fontFamily: 'Saira, sans-serif',
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.2,
        letterSpacing: 0,
    },
    h3: {
        fontFamily: 'Saira, sans-serif',
        fontWeight: 600,
        fontSize: '1.375rem',
        lineHeight: 1.33,
        letterSpacing: 0,
    },
    h4: {
        fontFamily: 'Saira, sans-serif',
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.33,
        letterSpacing: 0,
    },
    h5: {
        fontFamily: 'Saira, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.33,
        letterSpacing: 0,
    },
    h6: {
        fontFamily: 'Saira, sans-serif',
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.33,
        letterSpacing: 0,
    },
    body1: {
        fontFamily: 'Saira, sans-serif',
        fontSize: '1rem',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 1.5,
    },
};

const palette: PaletteOptions = {
    primary: {
        main: '#005962',
    },
    secondary: {
        main: '#508785',
    },
    background: {
        default: '#F3F7F7',
    },
    info: {
        main: '#ff6900',
    },
    grey: {
        '50': '#F9FBFB',
        '100': '#F3F7F7',
        '200': '#EBF0F1',
        '300': '#DEE2E2',
        '400': '#BBBFBF',
        '500': '#9AA1A2',
        '600': '#717879',
        '700': '#5D6465',
        '800': '#3E4546',
        '900': '#1C2526',
    },
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(6, 23, 24, 0.6)',
        disabled: 'rgba(9, 26, 27, 0.38)',
    },
    divider: 'rgba(17, 43, 45, 0.12)',
    action: {
        hover: 'rgba(235, 240, 241, 1.00)',
        selected: 'rgba(11, 33, 34, 0.08)',
        disabledBackground: 'rgba(13, 37, 38, 0.12)',
        focus: 'rgba(13, 37, 38, 0.12)',
        disabled: 'rgba(8, 22, 23, 0.26)',
        active: 'rgba(5, 15, 15, 0.54)',
    },
};

const components: Components = {
    MuiTextField: {
        defaultProps: {
            variant: 'filled',
        },
    },
    MuiFilledInput: {
        styleOverrides: {
            root: {
                backgroundColor: palette.grey?.['200'],
                '&:hover': {
                    backgroundColor: palette.grey?.['300'],
                },
                '&.Mui-focused': {
                    backgroundColor: palette.grey?.['200'],
                },
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                fontWeight: 700,
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            root: {
                fontWeight: 700,
            },
        },
    },
    MuiTableRow: {
        styleOverrides: {
            root: {
                backgroundColor: palette.common?.white,
                '&:hover': {
                    backgroundColor: palette.action?.hover,
                },
            },
        },
    },
};

export const theme: ThemeOptions = {
    typography,
    palette,
    components,
    productLogo: { logo: '' },
};

/**
 * Allow setting the logo as custom MUI Theme property through module augmentation.
 */
declare module '@mui/material/styles' {
    interface Theme {
        productLogo: {
            logo: string;
        };
    }

    interface ThemeOptions {
        productLogo?: {
            logo?: string;
        };
    }
}
