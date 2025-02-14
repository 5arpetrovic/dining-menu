import { useEffect, useState } from "react";
import { Grid, } from "@mui/material";
import { allMealsApi } from "../services/mealApi";
import { Meal, Meals } from "../types/meals";
import { MealCard } from "./MealCardComponent";
import { PaginationButtons } from './PanationButtonsComponent';
import { Loading } from "./LoadingComponent";
import { Error } from "./ErrorComponents";
import { useLocation } from 'react-router-dom';

export function SearchComponent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [displayedMeals, setDisplayedMeals] = useState<Meal[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');  // Stanje za pretragu
    const itemsPerPage = 9;

    const location = useLocation();

    // Učitaj searchQuery iz URL parametara
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchQuery(params.get('query') || '');  // Ako nema query parametra, koristi prazno
    }, [location.search]);

    useEffect(() => {
        async function loadMealApi() {
            setLoading(true);
            setError(null);
            try {
                const alphabet = "abcdefghijklmnopqrstuvwxyz";
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

    // Filtriranje obroka na osnovu searchQuery
    const filteredMeals = displayedMeals.filter(meal =>
        meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filteredMeals.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const paginatedMeals = filteredMeals.slice(
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
                    <>

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
                        </Grid>
                    </>
                )}
                <PaginationButtons
                    currentPage={currentPage}
                    totalItems={filteredMeals.length}
                    itemsPerPage={itemsPerPage}
                    onNext={handleNextPage}
                    onPrev={handlePrevPage}
                />
            </Grid>
        </>
    );
}
