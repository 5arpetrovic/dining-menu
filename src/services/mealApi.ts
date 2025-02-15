import axios from "axios";

const mealDbClient = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1/",
});

export async function getData(url: string, isOnlyMeals: boolean = false) {
  const response = await mealDbClient.get(url);
  return isOnlyMeals ? response.data.meals : response.data;
}
