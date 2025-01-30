import { Box, Button, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import { useSharedStyles } from '../styles/useSharedStyles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { alpha } from '@mui/system';

export function Header() {
    const { buttonStyles } = useSharedStyles();
    const navigate = useNavigate()

    const [category, setCategory] = React.useState('food-category');

    const handleClick = () => {
        navigate('/menu')
    }

    const handleClickNational = () => {
        navigate('/national-dishes')
    }

    const handleClickAll = () => {
        navigate('/all-menu')
    }

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 1rem',
                    borderColor: 'divider',
                    backgroundColor: 'transparent',
                }}
            >
                {/* Left-aligned elements */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                    }}
                >
                    <Button
                        onClick={() => navigate('/')}
                        variant="contained"
                        color="primary"
                        sx={{
                            ...buttonStyles('contained'),
                            animation: 'none',
                        }}
                    >
                        Home
                    </Button>

                    <FormControl>
                        <Select
                            id="demo-simple-select"
                            value={category}
                            onChange={handleChange}
                            displayEmpty
                            sx={{
                                backgroundColor: 'transparent',
                                color: 'text.secondary',
                                border: 'none',
                                borderColor: 'divider',
                                borderRadius: 1,
                                '&:hover': {
                                    borderColor: 'primary.main',

                                },
                                '& .MuiSelect-icon': {
                                    color: 'text.secondary',
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: alpha(theme.palette.secondary.main, 0.8),
                                    },
                                },
                            }}
                        >
                            <MenuItem value="food-category" sx={{ color: 'text.secondary' }} onClick={handleClick}>
                                Food Category
                            </MenuItem>
                            <MenuItem value="national-dishes" sx={{ color: 'text.secondary' }} onClick={handleClickNational}>
                                National Dishes
                            </MenuItem>
                            <MenuItem value="all-meals" sx={{ color: 'text.secondary' }} onClick={handleClickAll}>
                                All Meals
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Centered element */}
                <Box
                    sx={{
                        marginLeft: 'auto',
                        marginRight: '15px',
                    }}
                >
                    <Button
                        onClick={() => navigate('/add-meal')}
                        variant="outlined"
                        color="primary"
                        sx={{
                            ...buttonStyles('outlined'),
                            animation: 'none',
                        }}
                    >
                        Add Meal
                    </Button>
                </Box>

                {/* Right-aligned elements */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="outlined-basic" label="Search..." variant="outlined" />
                    </Box>

                    <Button
                        onClick={() => navigate('/continue')}
                        variant="outlined"
                        color="primary"
                        sx={{
                            ...buttonStyles('outlined'),
                            animation: 'none',
                        }}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

