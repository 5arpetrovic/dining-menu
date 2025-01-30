import { ThemeProvider } from "@emotion/react";
import { theme } from "../styles/theme";
import { Box, CssBaseline, Grid, Typography, CircularProgress, Button } from "@mui/material";
import { Header } from "./Header";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMealInfo } from "../services/mealApi";
import { Meal } from "../types/meals";
import { mealBackground } from "./MealComponents";

export function MealDetails() {
    const { id } = useParams<{ id: string }>();
    const [mealDetails, setMealDetails] = useState<Meal | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { backgroundLayer } = mealBackground();
    const navigate = useNavigate();

    useEffect(() => {
        async function loadMeal() {
            try {
                setLoading(true);
                const details = await fetchMealInfo(id!);
                setMealDetails(details.meals[0]);
            } catch {
                setError("Error fetching meal details.");
            } finally {
                setLoading(false);
            }
        }
        loadMeal();
    }, [id]);

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={backgroundLayer} />
                <Header />
                <CircularProgress sx={{ display: "block", margin: "auto", marginTop: 5 }} />
            </ThemeProvider>
        );
    }

    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={backgroundLayer} />
                <Header />
                <Box sx={{ textAlign: "center", marginTop: 5 }}>
                    <Typography variant="h6" color="error">{error}</Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate("/menu")}>
                        Back
                    </Button>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={backgroundLayer} />
            <Header />

            {mealDetails ? (
                <Grid container spacing={3} sx={{ padding: 3, justifyContent: "center" }}>
                    {/* Leva strana: Slika */}
                    <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                        <img
                            src={mealDetails.strMealThumb}
                            alt={mealDetails.strMeal}
                            style={{
                                borderRadius: "8px",
                                width: "100%",
                                maxHeight: "80vh", // Sprečava prelaženje slike preko ekrana
                                objectFit: "contain",
                            }}
                        />
                    </Grid>

                    {/* Desna strana: Sastojci i dugme */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" sx={{ marginBottom: 2, textAlign: "center" }}>
                            {mealDetails.strMeal}
                        </Typography>
                        <Typography variant="h6">Ingredients:</Typography>
                        <ul>
                            {Array.from({ length: 20 }).map((_, i) => {
                                const ingredient = mealDetails[`strIngredient${i + 1}` as keyof Meal];
                                const measure = mealDetails[`strMeasure${i + 1}` as keyof Meal];
                                return ingredient && measure ? (
                                    <li key={i}>{ingredient} - {measure}</li>
                                ) : null;
                            })}
                        </ul>
                        <Button variant="contained" color="primary" onClick={() => navigate("/menu")} sx={{ marginTop: 2 }}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <Typography textAlign="center">Meal details not found</Typography>
            )}
        </ThemeProvider>
    );
}
