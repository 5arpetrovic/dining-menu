import { Typography } from "@mui/material";

interface ErrorProps {
    message: string;
}
export const Error: React.FC<ErrorProps> = ({ message }) => (
    <Typography color="error" align="center" mt={2}>
        {message}
    </Typography>
);