import { Box, Button } from "@mui/material";
import { theme } from "../styles/theme";
import { useNavigate } from "react-router-dom";
import { useSharedStyles } from "../styles/useSharedStyles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { alpha } from "@mui/system";
import { useState, useEffect } from "react";

interface HeaderProps {
    setSearch: (searchText: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSearch }) => {
    const { buttonStyles } = useSharedStyles();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("food-category");

    useEffect(() => {
        const path = window.location.pathname;
        if (path === "/menu") {
            setCategory("food-category");
        } else if (path === "/national-dishes") {
            setCategory("national-dishes");
        } else if (path === "/ingredients") {
            setCategory("ingredient");
        }
    }, []);

    const handleNavigation = (path: string, category: string) => {
        navigate(path);
        setCategory(category);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    const handleSearch = (e: any) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearch(value);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 1rem",
                    borderColor: "divider",
                    backgroundColor: "transparent",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                    }}
                >
                    <Button
                        onClick={() => handleNavigation("/", "home-category")}
                        variant="contained"
                        color="primary"
                        sx={{
                            ...buttonStyles("contained"),
                            animation: "none",
                        }}
                    >
                        Home
                    </Button>

                    <FormControl>
                        <Select
                            id="demo-simple-select"
                            value={category}
                            onChange={handleChange}
                            displayEmpty
                            sx={{
                                backgroundColor: "transparent",
                                color: "text.secondary",
                                border: "none",
                                borderColor: "divider",
                                borderRadius: 1,
                                "&:hover": {
                                    borderColor: "primary.main",
                                },
                                "& .MuiSelect-icon": {
                                    color: "text.secondary",
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: alpha(theme.palette.secondary.main, 0.8),
                                    },
                                },
                            }}
                        >
                            <MenuItem
                                value="food-category"
                                sx={{ color: "text.secondary" }}
                                onClick={() => handleNavigation("/menu", "food-category")}
                            >
                                Food Category
                            </MenuItem>
                            <MenuItem
                                value="national-dishes"
                                sx={{ color: "text.secondary" }}
                                onClick={() =>
                                    handleNavigation("/national-dishes", "national-dishes")
                                }
                            >
                                National Dishes
                            </MenuItem>
                            <MenuItem
                                value="ingredient"
                                sx={{ color: "text.secondary" }}
                                onClick={() => handleNavigation("/ingredients", "ingredient")}
                            >
                                Ingredients
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    {window.location.pathname.length < 17 && (
                        <Box
                            component="form"
                            sx={{
                                "& > :not(style)": { m: 1, width: "25ch" },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                label="Search..."
                                variant="outlined"
                                value={searchQuery}
                                onChange={handleSearch}
                                sx={{ width: "25ch" }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};
