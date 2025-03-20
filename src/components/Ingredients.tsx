import { useState, useEffect } from "react";
import { theme } from "../styles/theme";
import { Grid, ListItem, ListItemText } from "@mui/material";
import { getData } from "../services/mealApi";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Meal } from "../types/meals";
import { alpha } from "@mui/system";
import { Loading } from "./LoadingComponent";
import { Error } from "./ErrorComponents";
import { MealCard } from "./MealCardComponent";
import { PaginationButtons } from "./PaginationButtonsComponent";

interface AllIngredientsProps {
    searchParams: string;
}

const cardHeight = 214;
const itemsPerPage = 12;

export const Ingredients: React.FC<AllIngredientsProps> = ({ searchParams }) => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (searchParams) {
            const filtered = ingredients.filter(ingredient =>
                ingredient.toLowerCase().includes(searchParams.toLowerCase())
            );
            setFilteredIngredients(filtered);

            if (!filtered.includes(selectedIngredient)) {
                setSelectedIngredient(filtered.length ? filtered[0] : "");
            }
        } else {
            setFilteredIngredients(ingredients);
        }
    }, [searchParams, ingredients]);


    useEffect(() => {
        const loadIngredients = async () => {
            try {
                setLoading(true);
                const data = await getData(`list.php?i=list`);
                const ingredientList = data.meals.map((meal: any) => meal.strIngredient);
                setIngredients(ingredientList);
                setFilteredIngredients(ingredientList);
                if (ingredientList.length) {
                    setSelectedIngredient(ingredientList[0]);
                }
            } catch (err) {
                setError("Failed to load ingredients.");
            } finally {
                setLoading(false);
            }
        };
        loadIngredients();
    }, []);

    useEffect(() => {
        if (!selectedIngredient) return;

        const loadMeals = async () => {
            try {
                setLoading(true);
                const data = await getData(`filter.php?i=${selectedIngredient}`);
                setMeals(data.meals || []);
                setCurrentPage(0);
            } catch (err) {
                setError("Failed to load meals.");
            } finally {
                setLoading(false);
            }
        };
        loadMeals();
    }, [selectedIngredient]);

    useEffect(() => {
        if (searchParams) {
            setFilteredIngredients(ingredients.filter(ingredient =>
                ingredient.toLowerCase().includes(searchParams.toLowerCase())
            ));
        } else {
            setFilteredIngredients(ingredients);
        }
    }, [searchParams, ingredients]);

    const handleIngredientSelect = (ingredient: string) => setSelectedIngredient(ingredient);
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

    const displayedMeals = meals.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const renderRow = ({ index, style }: ListChildComponentProps) => {
        const ingredient = filteredIngredients[index];
        const isSelected = selectedIngredient === ingredient;

        return (
            <div style={style} key={ingredient}>
                <ListItem
                    onClick={() => handleIngredientSelect(ingredient)}
                    sx={{
                        cursor: "pointer",
                        textAlign: "center",
                        color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main,
                        backgroundColor: isSelected
                            ? theme.palette.primary.light
                            : alpha(theme.palette.secondary.main, 0.8),
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                        borderRadius: 10,
                    }}
                >
                    <ListItemText
                        primary={ingredient.length > 10 ? `${ingredient.slice(0, 7)}...` : ingredient}
                    />
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
                            height={Math.min(filteredIngredients.length * 53, 53 * 13)}
                            width={140}
                            itemSize={53}
                            itemCount={filteredIngredients.length}
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
                        <Grid
                            container
                            sx={{
                                gap: 2,
                                padding: 2,
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                width: "100%",
                                boxSizing: "border-box",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                minHeight: `calc((${cardHeight}px + 16px) * 3)`,
                                alignContent: "flex-start",
                            }}
                        >
                            {displayedMeals.map((meal) => (
                                <MealCard
                                    key={meal.idMeal.toString()}
                                    meal={{
                                        ...meal,
                                        idMeal: meal.idMeal.toString(),
                                    }}
                                />
                            ))}
                        </Grid>

                        <Grid container justifyContent="center" alignItems="center" sx={{ marginTop: "16px" }}>
                            <PaginationButtons
                                currentPage={currentPage}
                                totalItems={meals.length}
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
};
