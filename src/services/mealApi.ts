import axios from 'axios';
import { Meals } from '../types/meals';

const mealDbClient = axios.create({
    baseURL: 'https://www.themealdb.com/api/json/v1/1/',
})
// generic type
export async function fetchMealCategories() {
    const response = await mealDbClient.get<Meals>('list.php?c=list');
    return response.data.meals;
}

export async function fetchMenuMealCategory(category: string) {
    const response = await mealDbClient.get<Meals>(`filter.php?c=${category}`);
    return response.data.meals;
}

//filter.php?c=

export async function fetchCountryCategories() {
    const response = await mealDbClient.get<Meals>(`list.php?a=list`)
    return response.data;
}

export async function fetchCountryMealCategories(country: string) {
    const response = await mealDbClient.get<Meals>(`filter.php?a=${country}`)
    return response.data;
}

export async function fetchMealInfo(meal: string) {
    const response = await mealDbClient.get<Meals>(`search.php?s=${meal}`)
    return response.data;
}

export async function allMealsApi(caracter: string) {
    const response = await mealDbClient.get<Meals>(`search.php?f=${caracter}`)
    return response.data;
}