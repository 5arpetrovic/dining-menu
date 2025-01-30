import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline, Grid, ListItem, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { alpha } from '@mui/system';
import { theme } from '../styles/theme';
import { fetchMealCategories, fetchMenuMealCategory } from '../services/mealApi';
import { Loading, Error, PaginationButtons, MealCard } from './MealComponents';
import { MealCategory, MenuMealCategory } from '../types/meals';
import { Header } from './Header';
import { allMenuBackground } from './MealComponents';
const { backgroundLayer } = allMenuBackground();

export function MenuPage() {
    const [categories, setCategories] = useState<MealCategory[]>([]);
    const [menuCategory, setMenuCategory] = useState<MenuMealCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [listHeight, setListHeight] = useState<number>(0);
    const headerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9;

    useEffect(() => {
        const updateHeight = () => {
            const headerHeight = headerRef.current?.getBoundingClientRect().height || 0;
            setListHeight(window.innerHeight - headerHeight);
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await fetchMealCategories();
                setCategories(data);
            } catch {
                setError('Failed to load meal categories.');
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
                const data = await fetchMenuMealCategory(selectedCategory);
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

    const handleCategorySelect = (category: string) => setSelectedCategory(category);
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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={backgroundLayer} />
            <div ref={headerRef}>
                <Header />
            </div>
            {loading ? (
                <Loading />
            ) : error ? (
                <Error message={error} />
            ) : (
                <Grid container sx={{ height: listHeight, width: "auto", boxSizing: "border-box" }}>
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
                    <Grid item md={10} >
                        <Grid container spacing={2} pt={2}>
                            {displayedMeals.map((meal) => (
                                <MealCard
                                    key={meal.idMeal.toString()}
                                    meal={{
                                        ...meal,
                                        idMeal: meal.idMeal.toString(),
                                    }}
                                />
                            ))}
                            {Array.from({ length: itemsPerPage - displayedMeals.length }).map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} key={`placeholder-${index}`}>
                                    <Box
                                        sx={{
                                            minHeight: 214,
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                </Grid>
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
        </ThemeProvider>
    );
}
