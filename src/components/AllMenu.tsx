import { useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../styles/theme";
import { Box, CssBaseline, Grid } from "@mui/material";
import { Header } from "./Header";
import { allMenuBackground } from "./MealComponents";
import { allMealsApi } from "../services/mealApi";
import { Meal, Meals } from "../types/meals";
import { Loading, Error, PaginationButtons, MealCard } from "./MealComponents";

export function AllMeals() {
    const { backgroundLayer } = allMenuBackground();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayedMeals, setDisplayedMeals] = useState<Meal[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const itemsPerPage = 9;

    useEffect(() => {
        async function loadMealApi() {
            setLoading(true);
            setError(null);
            try {
                // Paralelni API zahtevi za bolje performanse
                const requests = alphabet.split("").map((char) => allMealsApi(char));
                const results = await Promise.all(requests);

                const allMeals = results
                    .filter((data): data is Meals => data !== null && Array.isArray(data?.meals))
                    .flatMap((data) => data.meals);

                setDisplayedMeals(allMeals);
            } catch (error) {
                console.error(`Error: ${error}`);
                setError("Failed to load meals. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        loadMealApi();
    }, []);

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < displayedMeals.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const paginatedMeals = displayedMeals.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={backgroundLayer} />
            <Header />
            <Grid
                item
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "80vh",
                    alignItems: "stretch",
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingTop: 2,
                    marginTop: 0
                }}
            >
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Error message={error} />
                ) : (
                    <Grid container spacing={2}>
                        {paginatedMeals.map((meal) => (
                            <MealCard
                                key={meal.idMeal.toString()} // Konvertovanje za ključ
                                meal={{
                                    ...meal,
                                    idMeal: meal.idMeal.toString(), // Konvertovanje `idMeal` u string
                                }}
                            />
                        ))}
                        {Array.from({ length: itemsPerPage - paginatedMeals.length }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={`placeholder-${index}`}>
                                <Box
                                    sx={{
                                        minHeight: 214, // Ista visina kao MealCard
                                        backgroundColor: "transparent",
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
                <PaginationButtons
                    currentPage={currentPage}
                    totalItems={displayedMeals.length}
                    itemsPerPage={itemsPerPage}
                    onNext={handleNextPage}
                    onPrev={handlePrevPage}
                />
            </Grid>
        </ThemeProvider>
    );
}
