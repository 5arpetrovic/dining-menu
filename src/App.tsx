import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { theme } from "./styles/theme.tsx";
import { WelcomeMenu } from "./components/WelcomePage";
import { About } from "./components/AboutPage";
import { MenuPage } from "./components/MenuPage.tsx";
import { NationalDishes } from "./components/NationalDishes.tsx";
import { AllMeals } from "./components/AllMenu.tsx";
import { MealDetails } from "./components/MealDetails.tsx";
import { Header } from "./components/Header.tsx";
import { allMenuBackground } from "./styles/allMenuBackgroundStyle.tsx";
import { SearchComponent } from "./components/SearchComponent.tsx";
import { useState } from "react";

function Layout() {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/about"];
  const showBackgroundRoutes = [
    "/menu",
    "/national-dishes",
    "/all-menu",
    "/search",
  ];
  const { backgroundLayer } = allMenuBackground(); // Dobijanje pozadine
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
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<MealDetails />} />
        <Route path="/national-dishes" element={<NationalDishes />} />
        <Route
          path="/all-menu"
          element={<AllMeals searchParams={searchParams} />}
        />
        <Route path="/search" element={<SearchComponent />} />
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
