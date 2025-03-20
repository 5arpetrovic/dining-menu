import { useState, useEffect } from 'react';
import { Grid, ListItem, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { alpha } from '@mui/system';
import { theme } from '../styles/theme';
import { getData } from '../services/mealApi';
import { MealCard } from "./MealCardComponent";
import { PaginationButtons } from './PaginationButtonsComponent';
import { MealCategory, MenuMealCategory } from '../types/meals';
import { Loading } from "./LoadingComponent";
import { Error } from "./ErrorComponents";

interface FoodCategorieProp {
    searchParams: string;
}

const cardHeight = 214;
const itemsPerPage = 12;

export function MenuPage({ searchParams }: FoodCategorieProp) {
    const [categories, setCategories] = useState<MealCategory[]>([]);
    const [menuCategory, setMenuCategory] = useState<MenuMealCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<MealCategory | null>(null);
    const [filteredCategories, setFilteredCategories] = useState<MealCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [listHeight, setListHeight] = useState<number>(0);

    useEffect(() => {
        if (searchParams) {
            const filtered = categories.filter(category =>
                category?.strCategory?.toLowerCase().includes(searchParams.toLowerCase())
            );
            setFilteredCategories(filtered);

            if (!filtered.some(cat => cat.strCategory === selectedCategory?.strCategory)) {
                setSelectedCategory(filtered.length ? filtered[0] : null);
            }
        } else {
            setFilteredCategories(categories);
        }
    }, [searchParams, categories, selectedCategory]);

    useEffect(() => {
        if (categories.length > 0 && listHeight === 0) {
            setListHeight(Math.min(categories.length * 53, 53 * 13));
        }
    }, [categories, listHeight]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await getData("list.php?c=list", true);
                setCategories(Array.isArray(data) ? data : []);

                if (Array.isArray(data) && data.length) {
                    setSelectedCategory(data[0]);
                }
            } catch {
                setError("Failed to load meal categories.");
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;
        const loadMenuItems = async () => {
            try {
                setLoading(true);
                const data = await getData(`filter.php?c=${selectedCategory.strCategory}`, true);
                setMenuCategory(data);
                setCurrentPage(0);
            } catch {
                setError(`Failed to load menu items for ${selectedCategory.strCategory}`);
            } finally {
                setLoading(false);
            }
        };
        loadMenuItems();
    }, [selectedCategory]);

    const handleCategorySelect = (category: MealCategory) => setSelectedCategory(category);
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

    const displayedMeals = menuCategory.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const renderRow = ({ index, style }: ListChildComponentProps) => {
        const category = filteredCategories[index];
        const isSelected = selectedCategory?.strCategory === category?.strCategory;

        return (
            <div style={style} key={category.strCategory}>
                <ListItem
                    onClick={() => handleCategorySelect(category)}
                    sx={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main,
                        backgroundColor: isSelected
                            ? theme.palette.primary.light
                            : alpha(theme.palette.secondary.main, 0.8),
                        '&:hover': { backgroundColor: theme.palette.primary.main },
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
                            height={listHeight}
                            width={140}
                            itemSize={53}
                            itemCount={filteredCategories.length}
                            overscanCount={5}
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {renderRow}
                        </FixedSizeList>
                    </Grid>
                    <Grid container item md={10} >
                        <Grid container
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
                                    meal={{ ...meal, idMeal: meal.idMeal.toString() }}
                                />
                            ))}
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center" mt={2} pb={0}>
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
