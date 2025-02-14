import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { allMealsApi } from "../services/mealApi";
import { Meal, Meals } from "../types/meals";
import { MealCard } from "./MealCardComponent";
import { PaginationButtons } from './PanationButtonsComponent';
import { Loading } from "./LoadingComponent";
import { Error } from "./ErrorComponents";

export function AllMeals() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [displayedMeals, setDisplayedMeals] = useState<Meal[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
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
        <>
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
                                key={meal.idMeal.toString()}
                                meal={{
                                    ...meal,
                                    idMeal: meal.idMeal.toString(),
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
        </>
    );
}


