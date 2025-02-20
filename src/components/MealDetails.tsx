import { Box, Grid, Typography, CircularProgress, Button } from "@mui/material";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getData } from "../services/mealApi";
import { Meal } from "../types/meals";
import { mealBackground } from "../styles/mealBackgroundStyle";

export function MealDetails() {
  const { id } = useParams<{ id: string }>();
  const [mealDetails, setMealDetails] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { backgroundLayer } = mealBackground();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMeal() {
      try {
        setLoading(true);
        const details = await getData(
          `search.php?s=${id?.replace(/-/g, " ")!}`
        );
        setLoading(false);
        setMealDetails(details.meals[0]);
      } catch (err: any) {
        setLoading(false);
        console.log(err.message);
        setError("Error fetching meal details.");
      }
    }
    loadMeal();
  }, [id]);

  if (loading) {
    return (
      <>
        <Box sx={backgroundLayer} />
        <CircularProgress
          sx={{ display: "block", margin: "auto", marginTop: 5 }}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Box sx={backgroundLayer} />
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/menu")}
          >
            Back
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box sx={backgroundLayer} />
      {mealDetails ? (
        <Grid
          container
          spacing={3}
          sx={{ padding: 3, justifyContent: "center" }}
        >
          {/* Leva strana: Slika */}
          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <img
              src={mealDetails.strMealThumb}
              alt={mealDetails.strMeal}
              style={{
                borderRadius: "8px",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </Grid>

          {/* Desna strana: Sastojci i dugme */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{ marginBottom: 2, textAlign: "center" }}
            >
              {mealDetails.strMeal}
            </Typography>
            <Typography variant="h6">Ingredients:</Typography>

            {/* Box sa sastojcima, omogućeno skrolovanje */}
            <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
              <ul>
                {Array.from({ length: 20 }).map((_, i) => {
                  const ingredient =
                    mealDetails[`strIngredient${i + 1}` as keyof Meal];
                  const measure =
                    mealDetails[`strMeasure${i + 1}` as keyof Meal];
                  return ingredient && measure ? (
                    <li key={i}>
                      {ingredient} - {measure}
                    </li>
                  ) : null;
                })}
              </ul>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/menu")}
              sx={{ marginTop: 2 }}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography textAlign="center">Meal details not found</Typography>
      )}
    </>
  );
}
