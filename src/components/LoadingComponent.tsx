import { Box, CircularProgress } from "@mui/material";

export const Loading: React.FC = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
        }}
    >
        <CircularProgress />
    </Box>
);
