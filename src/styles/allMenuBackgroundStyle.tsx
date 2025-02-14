import { SxProps } from "@mui/material";
import menuBackground from "../assets/menuBackground.jpeg";

export const allMenuBackground = () => {
    const backgroundLayer: SxProps = {
        backgroundImage: `url(${menuBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -1,
    };
    return {
        backgroundLayer,
    }
}