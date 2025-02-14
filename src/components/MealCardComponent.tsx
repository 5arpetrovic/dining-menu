import { MealCardProps } from "../types/meals";

import { useNavigate } from "react-router-dom";

import { Grid, Typography } from "@mui/material";

import { alpha } from "@mui/system";

import { theme } from "../styles/theme";


export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
    const navigate = useNavigate();

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