import { Box, Typography, Button, CssBaseline, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { useSharedStyles } from '../styles/useSharedStyles';

export function About() {
    const { fadeIn, sharedBoxStyles, backgroundLayer, buttonStyles } = useSharedStyles();
    const navigate = useNavigate();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={sharedBoxStyles}>
                <Box sx={backgroundLayer} />
                <Typography
                    variant="h2"
                    sx={{
                        zIndex: 1,
                        animation: `${fadeIn} 2s ease-in`,
                    }}
                >
                    About Us
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        zIndex: 1,
                        maxWidth: '600px',
                        lineHeight: 1.6,
                        textAlign: 'center',
                        marginTop: 2,
                        animation: `${fadeIn} 2s ease-in`,
                        whiteSpace: 'pre-line', // Prikazuje razmake i prelome linija
                    }}
                >
                    {`Address: Art Square 15, Belgrade, Serbia
Phone: +381 11 987 6543
Email: info@restaurantpicasso.com

Working Hours:

Mon-Fri: 12:00 PM - 11:00 PM
Saturday: 10:00 AM - 11:30 PM
Sunday: 10:00 AM - 10:00 PM`}
                </Typography>
                <Button
                    onClick={() => navigate('/')}
                    variant="outlined"
                    color="primary"
                    sx={{
                        ...buttonStyles('outlined'),
                        mt: '15px',
                    }}
                >
                    Home
                </Button>
            </Box>
        </ThemeProvider>
    );
}
