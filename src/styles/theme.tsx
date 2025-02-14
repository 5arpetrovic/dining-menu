import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#d89c56',
        },
        secondary: {
            main: '#1c1c1c',
        },
        text: {
            primary: '#ffffff',
            secondary: '#d89c56',
        },
        background: {
            default: '#1c1c1c',
        },
    },
    typography: {
        fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
        h2: {
            fontSize: '3rem',
            fontWeight: 700,
            color: '#ffffff',
        },
        body1: {
            fontSize: '1.2rem',
            color: '#ffffff',
        },
    },
});
