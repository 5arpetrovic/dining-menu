import { Box, Typography, Button, CssBaseline, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { useSharedStyles } from '../styles/useSharedStyles';

export function WelcomeMenu() {
    const { fadeIn, slideInFromRight, sharedBoxStyles, backgroundLayer, buttonStyles } = useSharedStyles();
    const navigate = useNavigate();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={sharedBoxStyles}>
                <Box sx={backgroundLayer} />
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            animation: `${slideInFromRight} 1.5s ease-out`,
                        }}
                    >
                        Welcome to the restaurant Picasso
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: '600px',
                            margin: '1.5rem auto',
                            animation: `${fadeIn} 2s ease-in`,
                        }}
                    >
                        Welcome to Picasso, where modern elegance meets culinary perfection.
                        Our menu combines the finest local ingredients with global techniques,
                        offering a sophisticated experience for those with refined taste. At Picasso,
                        every dish is a masterpiece—where flavor meets art.
                    </Typography>
                    <Button
                        onClick={() => navigate('/menu')}
                        variant="contained"
                        color="primary"
                        sx={{
                            ...buttonStyles('contained'),
                            marginRight: '10px', // Razmak desno između dugmadi
                        }}>
                        View Menu
                    </Button>
                    <Button
                        onClick={() => navigate('/about')}
                        variant="outlined"
                        color="primary"
                        sx={buttonStyles('outlined')}
                    >
                        About Us
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
