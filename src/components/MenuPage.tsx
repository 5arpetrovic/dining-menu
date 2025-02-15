import { useState, useEffect } from "react";
import { Box, Grid, ListItem, ListItemText } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { alpha } from "@mui/system";
import { theme } from "../styles/theme";
import { getData } from "../services/mealApi";
import { MealCard } from "./MealCardComponent";
import { PaginationButtons } from "./PanationButtonsComponent";
import { MealCategory, MenuMealCategory } from "../types/meals";
import { Loading } from "./LoadingComponent";
import { Error } from "./ErrorComponents";

export function MenuPage() {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [menuCategory, setMenuCategory] = useState<MenuMealCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getData("list.php?c=list", true);
        setCategories(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length) {
          setSelectedCategory(data[0].strCategory);
        }
      } catch {
        setError("Failed to load meal categories.");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Učitaj stavke menija na osnovu selektovane kategorije
  useEffect(() => {
    if (!selectedCategory) return;
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        const data = await getData(`filter.php?c=${selectedCategory}`, true);
        setMenuCategory(data);
        setCurrentPage(0);
      } catch {
        setError(`Failed to load menu items for ${selectedCategory}`);
      } finally {
        setLoading(false);
      }
    };
    loadMenuItems();
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) =>
    setSelectedCategory(category);

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const displayedMeals = menuCategory.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const category = categories[index];
    const isSelected = selectedCategory === category?.strCategory;
    return (
      <div style={style} key={category.strCategory}>
        <ListItem
          onClick={() => handleCategorySelect(category.strCategory)}
          sx={{
            cursor: "pointer",
            textAlign: "center",
            marginBottom: 15,
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
          <ListItemText primary={category.strCategory} />
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
              height={Math.min(categories.length * 53, 53 * 13)}
              width={140}
              itemSize={53}
              itemCount={categories.length}
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
            <Grid container gap={2} pt={2}>
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
