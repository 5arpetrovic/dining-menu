import { useState, useEffect } from "react";
import { theme } from "../styles/theme";
import { Box, Grid, ListItem, ListItemText } from "@mui/material";
import { getData } from "../services/mealApi";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Area, MenuMealCategory } from "../types/meals";
import { alpha } from "@mui/system";
import { Loading } from "./LoadingComponent";
import { Error } from "./ErrorComponents";
import { MealCard } from "./MealCardComponent";
import { PaginationButtons } from "./PanationButtonsComponent";

export function NationalDishes() {
  const [countries, setCountries] = useState<Area[]>([]);
  const [menuCategory, setMenuCategory] = useState<MenuMealCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await getData(`list.php?a=list`);
        setCountries(data.meals);

        // Ako postoje zemlje, postavi prvu kao selektovanu
        if (data.meals.length) {
          setSelectedCategory(data.meals[0].strArea);
        }
      } catch (err) {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  // Učitaj kategorije menija na osnovu selektovane zemlje
  useEffect(() => {
    if (!selectedCategory) return;

    const loadMenuCategory = async () => {
      try {
        setLoading(true);
        const data = await getData(`filter.php?a=${selectedCategory}`);
        setMenuCategory(data.meals);
        setCurrentPage(0);
      } catch (err) {
        setError("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    loadMenuCategory();
  }, [selectedCategory]);

  // Funkcija za selektovanje kategorije
  const handleCategorySelect = (category: string) =>
    setSelectedCategory(category);

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  // Prikazani obroci za trenutnu stranicu
  const displayedMeals = menuCategory.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const country = countries[index];
    const isSelected = selectedCategory === country?.strArea;

    return (
      <div style={style} key={country.strArea}>
        <ListItem
          onClick={() => handleCategorySelect(country.strArea)}
          sx={{
            cursor: "pointer",
            textAlign: "center",
            color: isSelected
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
            backgroundColor: isSelected
              ? theme.palette.primary.light
              : alpha(theme.palette.secondary.main, 0.8),
            "&:hover": { backgroundColor: theme.palette.primary.main },
            borderRadius: 10,
          }}
        >
          <ListItemText primary={country.strArea} />
        </ListItem>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} />
      ) : (
        <Grid container sx={{ width: "auto", boxSizing: "border-box" }}>
          <Grid item md={1.5}>
            <FixedSizeList
              height={Math.min(countries.length * 53, 53 * 13)}
              width={140}
              itemSize={53}
              itemCount={countries.length}
              overscanCount={5}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {renderRow}
            </FixedSizeList>
          </Grid>
          <Grid item md={10}>
            <Grid container pt={2} gap={2}>
              {displayedMeals.map((meal) => (
                <MealCard
                  key={meal.idMeal.toString()}
                  meal={{
                    ...meal,
                    idMeal: meal.idMeal.toString(),
                  }}
                />
              ))}
              {Array.from({ length: itemsPerPage - displayedMeals.length }).map(
                (_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`placeholder-${index}`}>
                    <Box
                      sx={{
                        minHeight: 214,
                        backgroundColor: "transparent",
                      }}
                    />
                  </Grid>
                )
              )}
            </Grid>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              mt={2}
              pb={0}
            >
              <PaginationButtons
                currentPage={currentPage}
                totalItems={menuCategory.length}
                itemsPerPage={itemsPerPage}
                onNext={handleNextPage}
                onPrev={handlePrevPage}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
