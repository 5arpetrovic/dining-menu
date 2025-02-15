import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { getData } from "../services/mealApi";
import { Meal, Meals } from "../types/meals";
import { MealCard } from "./MealCardComponent";
import { PaginationButtons } from "./PanationButtonsComponent";
import { Loading } from "./LoadingComponent";
import { Error } from "./ErrorComponents";

interface AllMealProps {
  searchParams: string;
}

export const AllMeals: React.FC<AllMealProps> = ({ searchParams }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mealsToSearch, setMealsToSearch] = useState<Meal[]>([]);
  const [displayedMeals, setDisplayedMeals] = useState<Meal[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paginatedMeals, setPaginatedMeals] = useState<Meal[]>([]);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const itemsPerPage = 9;

  useEffect(() => {
    async function loadMealApi() {
      setLoading(true);
      setError(null);
      try {
        // Paralelni API zahtevi za bolje performanse
        const requests = alphabet
          .split("")
          .map((char) => getData(`search.php?f=${char}`));
        const results = await Promise.all(requests);

        const allMeals = results
          .filter(
            (data: any): data is Meals =>
              data !== null && Array.isArray(data?.meals)
          )
          .flatMap((data: any) => data.meals);

        setDisplayedMeals(allMeals);
        setMealsToSearch(allMeals);
      } catch (error) {
        console.error(`Error: ${error}`);
        setError("Failed to load meals. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadMealApi();
  }, []);

  useEffect(() => {
    let filteredMeals = mealsToSearch;

    if (searchParams.length) {
      filteredMeals = mealsToSearch.filter((el: Meal) =>
        el.strMeal.toLowerCase().includes(searchParams.toLowerCase())
      );
    }

    setDisplayedMeals(filteredMeals);
    setPaginatedMeals(
      filteredMeals.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    );
  }, [searchParams, mealsToSearch, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchParams]);

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
          marginTop: 0,
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
            {Array.from({ length: itemsPerPage - paginatedMeals.length }).map(
              (_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`placeholder-${index}`}>
                  <Box
                    sx={{
                      minHeight: 214, // Ista visina kao MealCard
                    }}
                  />
                </Grid>
              )
            )}
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
};
