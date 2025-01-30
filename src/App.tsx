import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { theme } from "./styles/theme.tsx";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WelcomeMenu } from "./components/WelcomePage";
import { About } from "./components/AboutPage";
import { MenuPage } from "./components/MenuPage.tsx";
import { NationalDishes } from "./components/NationalDishes.tsx";
import { AllMeals } from "./components/AllMenu.tsx";
import { MealDetails } from "./components/MealDetails.tsx";
import './App.css';




function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomeMenu />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/menu/:id" element={<MealDetails />} /> {/* Route Params */}
                    <Route path="/national-dishes" element={<NationalDishes />} />
                    <Route path="/all-menu" element={<AllMeals />} />
                </Routes>
            </Router>
        </ThemeProvider>
    )

}


export default App


{/* <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Resetuje osnovne stilove 
            <HomePage />
        </ThemeProvider> */}