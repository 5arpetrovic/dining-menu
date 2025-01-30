import { keyframes } from '@mui/system';
import { SxProps } from '@mui/system';
import backgroundImage from "../assets/background.jpg";

// **1. Animacije**
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// **2. Custom hook za deljenje stilova**
export const useSharedStyles = () => {
  const sharedBoxStyles: SxProps = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column', // Dodato da komponente budu vertikalno složene
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'background.default',
    color: 'text.primary',
    textAlign: 'center',
  };

  const backgroundLayer: SxProps = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  };

  const buttonStyles = (variant: 'contained' | 'outlined'): SxProps => ({
    borderRadius: '30px',
    textTransform: 'none',
    padding: '10px 20px',
    fontSize: '1rem',
    animation: `${fadeIn} 2s ease-in`,
    ...(variant === 'outlined' && {
      color: 'primary.main',
      borderColor: 'primary.main',
      '&:hover': {
        backgroundColor: 'primary.main',
        color: '#fff',
      },
    }),
    ...(variant === 'contained' && {
      backgroundColor: 'primary.main',
      color: '#fff',
      '&:hover': {
        backgroundColor: 'primary.main', // Ostaje ista boja
        cursor: 'default', // Sprečava promenu kursora
      },
    }),
  });

  return {
    fadeIn,
    slideInFromRight,
    sharedBoxStyles,
    backgroundLayer,
    buttonStyles,
  };
};
