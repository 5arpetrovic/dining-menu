import React from "react";
import { Box, CircularProgress, Button, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SxProps } from "@mui/material";
import menuBackground from "../assets/menuBackground.jpeg";
import foodBackground from "../assets/foodBackground.jpg";
import { theme } from "../styles/theme";
import { useNavigate } from "react-router-dom";


// Komponenta za prikaz učitavanja
export const Loading: React.FC = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
        }}
    >
        <CircularProgress />
    </Box>
);

// Komponenta za prikaz grešaka
interface ErrorProps {
    message: string;
}
export const Error: React.FC<ErrorProps> = ({ message }) => (
    <Typography color="error" align="center" mt={2}>
        {message}
    </Typography>
);

// Komponenta za dugmad za paginaciju
interface PaginationButtonsProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onNext: () => void;
    onPrev: () => void;
}


export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onNext,
    onPrev,
}) => (
    <Grid container
        justifyContent="space-between"
        alignItems="center"
        sx={{
            position: "sticky", // ili "absolute" ako je potreban direktan fiksni položaj
            bottom: 0,
            left: 0,
            right: 0,
            padding: 1,

            zIndex: 1,
        }} >
        <Button
            variant="contained"
            color="primary"
            onClick={onPrev}
            disabled={currentPage === 0}
        >
            Previous
        </Button>
        <Button
            variant="contained"
            color="primary"
            onClick={onNext}
            disabled={(currentPage + 1) * itemsPerPage >= totalItems}
        >
            Next
        </Button>
    </Grid>
);

// Komponenta za prikaz pojedinačnog obroka
interface MealCardProps {
    meal: {
        idMeal: string;
        strMeal: string;
        strMealThumb: string;
    };
}


export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
    const navigate = useNavigate(); // Premestiti ovde

    return (
        <Grid
            item
            key={meal.idMeal}
            xs={12}
            sm={6}
            md={4}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "230px",
                backgroundColor: alpha(theme.palette.secondary.light, 0.6),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.8),
                    transform: "scale(1.05)",
                },
            }}
            onClick={() => navigate(`/menu/${meal.strMeal}`)}
        >
            <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{
                    width: "120px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: "16px",
                }}
            />
            <Typography
                variant="subtitle1"
                align="center"
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    wordWrap: "break-word",
                    width: "100%",
                }}
            >
                {meal.strMeal}
            </Typography>
        </Grid>
    );
};



export const allMenuBackground = () => {
    const backgroundLayer: SxProps = {
        backgroundImage: `url(${menuBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -1,
    };
    return {
        backgroundLayer,
    }
}

export const mealBackground = () => {
    const backgroundLayer: SxProps = {
        backgroundImage: `url(${foodBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -1,
    };
    return {
        backgroundLayer,
    }
}