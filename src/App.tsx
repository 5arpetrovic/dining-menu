import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { Box } from "@mui/material";
import { theme } from "./styles/theme.tsx";
import { WelcomeMenu } from "./components/WelcomePage";
import { About } from "./components/AboutPage";
import { MenuPage } from "./components/MenuPage.tsx";
import { NationalDishes } from "./components/NationalDishes.tsx";
import { Ingredients } from "./components/Ingredients.tsx";
import { MealDetails } from "./components/MealDetails.tsx";
import { Header } from "./components/Header.tsx";
import { allMenuBackground } from "./styles/allMenuBackgroundStyle.tsx";

function Layout() {
    const location = useLocation();
    const hideHeaderRoutes = ["/", "/about"];
    const showBackgroundRoutes = [
        "/menu",
        "/national-dishes",
        "/ingredients",
        "/search",
    ];
    const { backgroundLayer } = allMenuBackground();
    const [searchParams, setSearchParams] = useState<string>("");

    return (
        <>
            {showBackgroundRoutes.includes(location.pathname) && (
                <Box sx={backgroundLayer} />
            )}
            {!hideHeaderRoutes.includes(location.pathname) && (
                <Header setSearch={setSearchParams} />
            )}

            <Routes>
                <Route path="/" element={<WelcomeMenu />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<MenuPage searchParams={searchParams} />} />
                <Route path="/menu/:id" element={<MealDetails />} />
                <Route path="/national-dishes" element={<NationalDishes searchParams={searchParams} />} />
                <Route
                    path="/ingredients"
                    element={<Ingredients searchParams={searchParams} />}
                />
            </Routes>
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout />
            </Router>
        </ThemeProvider>
    );
}

export default App;
