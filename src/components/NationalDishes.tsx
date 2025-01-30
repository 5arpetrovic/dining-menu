import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../styles/theme";
import { Box, CssBaseline, Grid, ListItem, ListItemText } from "@mui/material";
import { Header } from "./Header";
import { allMenuBackground } from "./MealComponents";
import { fetchCountryCategories, fetchCountryMealCategories } from "../services/mealApi";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Loading, Error, PaginationButtons, MealCard } from "./MealComponents";
import { Area, MenuMealCategory } from "../types/meals";
import { alpha } from "@mui/system";

export function NationalDishes() {
    const [countries, setCountries] = useState<Area[]>([]);
    const [menuCategory, setMenuCategory] = useState<MenuMealCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { backgroundLayer } = allMenuBackground();
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

        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        const loadCountries = async () => {
            try {
                setLoading(true);
                const data = await fetchCountryCategories();
                setCountries(data.meals);
            } catch (err) {
                setError("Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };

        loadCountries();
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;

        const loadMenuCategory = async () => {
            try {
                setLoading(true);
                const data = await fetchCountryMealCategories(selectedCategory);
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

    const handleCategorySelect = (category: string) => setSelectedCategory(category);
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

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
                        color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main,
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
                                            minHeight: 214, // Ista visina kao MealCard
                                            backgroundColor: "transparent",
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



// import { ThemeProvider } from "@emotion/react";
// import { theme } from "../styles/theme";
// import { Box, CssBaseline, Grid, Typography, CircularProgress, alpha, Button, ListItem, ListItemText } from "@mui/material";
// import { Header } from "./Header";
// import { useState, useEffect, useRef, } from "react";
// import { allMenuBackground } from "./MealComponents";
// import { fetchCountryCategories, fetchCountryMealCategories } from "../services/mealApi";
// import { Area, MenuMealCategory } from "../types/meals";
// import { FixedSizeList, ListChildComponentProps } from "react-window";
// import { useNavigate } from "react-router-dom";


// export function NationalDishes() {
//     const [countries, setCountries] = useState<Area[]>([]);
//     const [menuCategory, setMenuCategory] = useState<MenuMealCategory[]>([]);
//     const [selectedCategory, setSelectedCategory] = useState<string>("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const { backgroundLayer } = allMenuBackground();
//     const [listHeight, setListHeight] = useState<number>(0);
//     const headerRef = useRef<HTMLDivElement>(null);
//     const [currentPage, setCurrentPage] = useState(0);
//     const itemsPerPage = 9;
//     const navigate = useNavigate()



//     useEffect(() => {
//         const updateHeight = () => {
//             const headerHeight = headerRef.current?.getBoundingClientRect().height || 0;
//             const availableHeight = window.innerHeight - headerHeight;
//             setListHeight(availableHeight);
//         };
//         updateHeight();

//         window.addEventListener("resize", updateHeight);

//         return () => {
//             window.removeEventListener("resize", updateHeight);
//         };
//     }, []);

//     useEffect(() => {
//         if (!selectedCategory) return;

//         async function loadMenuCategory() {
//             try {
//                 setLoading(true);
//                 const data = await fetchCountryMealCategories(selectedCategory);
//                 setMenuCategory(data.meals);
//                 setCurrentPage(0);
//             } catch (err) {
//                 setError("Failed to load menu items.");
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadMenuCategory();
//     }, [selectedCategory]);

//     useEffect(() => {
//         async function loadCountries() {
//             try {
//                 setLoading(true);
//                 const data = await fetchCountryCategories();
//                 setCountries(data.meals);
//             } catch (err) {
//                 setError("Failed to load categories.");
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadCountries();
//     }, []);

//     const handleCategorySelect = (category: string) => {
//         setSelectedCategory(category);
//     };


//     const handleNextPage = () => {
//         if ((currentPage + 1) * itemsPerPage < menuCategory.length) {
//             setCurrentPage((prev) => prev + 1);
//         }
//     };

//     const handlePrevPage = () => {
//         if (currentPage > 0) {
//             setCurrentPage((prev) => prev - 1);
//         }
//     };

//     const displayedMeals = menuCategory.slice(
//         currentPage * itemsPerPage,
//         (currentPage + 1) * itemsPerPage
//     );

//     const renderRow = ({ index, style }: ListChildComponentProps) => {
//         const country = countries[index];
//         const isSelected = selectedCategory === country?.strArea;

//         return (
//             <div style={style} key={index}>
//                 <ListItem
//                     component="li"
//                     onClick={() => handleCategorySelect(country.strArea)}
//                     sx={{
//                         cursor: "pointer",
//                         display: "flex",
//                         textAlign: "center",
//                         color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main,
//                         backgroundColor: isSelected
//                             ? theme.palette.primary.light
//                             : alpha(theme.palette.secondary.main, 0.8),
//                         "&:hover": {
//                             backgroundColor: theme.palette.primary.main,
//                             color: theme.palette.text.primary,
//                         },
//                         borderRadius: 10,
//                         zIndex: 1,
//                     }}
//                 >
//                     <ListItemText primary={country.strArea} />
//                 </ListItem>

//             </div>
//         );
//     };

//     return (
//         <ThemeProvider theme={theme}>
//             <CssBaseline />
//             <Box sx={backgroundLayer} />
//             <div ref={headerRef}>
//                 <Header />
//             </div>
//             <Grid container sx={{ height: listHeight, width: 'auto', boxSizing: "border-box" }} >

//                 <Grid item md={1.3} >
//                     {loading ? (
//                         <p>Loading...</p>
//                     ) : error ? (
//                         <p>{error}</p>
//                     ) : (
//                         <FixedSizeList
//                             height={53 * 13} // Visina za tačno 13 stavki
//                             width={120} // Širina liste
//                             itemSize={53} // Visina pojedinačne stavke
//                             itemCount={countries.length} // Ukupan broj stavki
//                             overscanCount={5} // Prethodno i sledeće učitane stavke za bolju performansu
//                             style={{
//                                 scrollbarWidth: "none",
//                                 msOverflowStyle: "none",
//                             }}
//                         >
//                             {renderRow}
//                         </FixedSizeList>
//                     )}
//                 </Grid>


//                 <Grid item md={10.6} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: listHeight, alignItems: "stretch", boxSizing: "border-box" }}>
//                     {/* Meni */}
//                     {loading ? (
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 minHeight: "80vh",
//                             }}
//                         >
//                             <CircularProgress />
//                         </Box>
//                     ) : error ? (
//                         <Typography color="error">{error}</Typography>
//                     ) : (
//                         <Grid container sx={{ marginTop: '0px' }}>
//                             {displayedMeals.map((meal) => (
//                                 <Grid
//                                     item
//                                     spacing={2}
//                                     key={meal.idMeal}
//                                     xs={12}
//                                     sm={6}
//                                     md={4}
//                                     sx={{
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         justifyContent: "center",
//                                         alignItems: "center",
//                                         height: "230px",
//                                         // padding: 2,
//                                         marginRight: 0,
//                                         marginBottom: 'auto',
//                                         backgroundColor: alpha(theme.palette.secondary.light, 0.6),
//                                         border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//                                         borderRadius: "8px",
//                                         transition: "background-color 0.3s ease, transform 0.3s ease",
//                                         cursor: "pointer",
//                                         "&:hover": {
//                                             backgroundColor: alpha(theme.palette.primary.main, 0.8),
//                                             transform: "scale(1.05)",
//                                         },
//                                     }}
//                                     onClick={() => navigate(`/menu/${meal.strMeal}`)}
//                                 >
//                                     <img
//                                         src={meal.strMealThumb}
//                                         alt={meal.strMeal}
//                                         style={{
//                                             width: "120px",
//                                             height: "100px",
//                                             objectFit: "cover",
//                                             borderRadius: "50%",
//                                             marginBottom: "16px",
//                                         }}
//                                     />
//                                     <Typography
//                                         variant="subtitle1"
//                                         align="center"
//                                         sx={{
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             display: "-webkit-box",
//                                             WebkitBoxOrient: "vertical",
//                                             WebkitLineClamp: 2,
//                                             wordWrap: "break-word",
//                                             width: "100%",
//                                         }}
//                                     >
//                                         {meal.strMeal}
//                                     </Typography>
//                                 </Grid>

//                             ))}
//                         </Grid>
//                     )}

//                     <Grid container item direction="row" pb={2} sx={{ justifyContent: "space-between", alignItems: "flex-end", }}>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handlePrevPage}
//                             disabled={currentPage === 0}
//                         >
//                             Previous
//                         </Button>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handleNextPage}
//                             disabled={(currentPage + 1) * itemsPerPage >= menuCategory.length}
//                         >
//                             Next
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Grid>
//         </ThemeProvider >

//     )
// }
