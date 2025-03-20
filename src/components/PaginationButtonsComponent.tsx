import { PaginationButtonsProps } from "../types/meals";
import { Grid, Button } from "@mui/material";

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onNext,
    onPrev,
}) => (
    <Grid container
        justifyContent="space-between"
        alignItems="center"
        sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 1,
            zIndex: 1,
        }} >
        <Button
            variant="contained"
            color="primary"
            onClick={onPrev}
            disabled={currentPage === 0}
        >
            Previous
        </Button>
        <Button
            variant="contained"
            color="primary"
            onClick={onNext}
            disabled={(currentPage + 1) * itemsPerPage >= totalItems}
        >
            Next
        </Button>
    </Grid>
);