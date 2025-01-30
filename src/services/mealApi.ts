import axios from 'axios';
import { Meals, AreaList } from '../types/meals';

const mealDbClient = axios.create({
    baseURL: 'https://www.themealdb.com/api',
});

export async function fetchMealCategories() {
    const response = await mealDbClient.get<Meals>('/json/v1/1/list.php?c=list');
    return response.data.meals;
}

export async function fetchMenuMealCategory(category: string) {
    const response = await mealDbClient.get<Meals>(`/json/v1/1/filter.php?c=${category}`);
    return response.data.meals;
}

export async function fetchCountryCategories() {
    const response = await mealDbClient.get<AreaList>(`/json/v1/1/list.php?a=list`)
    return response.data;
}

export async function fetchCountryMealCategories(country: string) {
    const response = await mealDbClient.get<Meals>(`/json/v1/1/filter.php?a=${country}`)
    return response.data;
}

export async function fetchMealInfo(meal: string) {
    const response = await mealDbClient.get<Meals>(`/json/v1/1/search.php?s=${meal}`)
    return response.data;
}

export async function allMealsApi(caracter: string) {
    const response = await mealDbClient.get<Meals>(`/json/v1/1/search.php?f=${caracter}`)
    return response.data;
}
// www.themealdb.com/api/json/v1/1/filter.php?c=Seafood


// const test = fetchMealCategories().then(res => res.data)