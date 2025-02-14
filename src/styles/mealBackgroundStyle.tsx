import { SxProps } from "@mui/material";
import foodBackground from "../assets/foodBackground.jpg";

export const mealBackground = () => {
    const backgroundLayer: SxProps = {
        backgroundImage: `url(${foodBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
    };
    return {
        backgroundLayer,
    }
}