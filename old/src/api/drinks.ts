import { TDrinksData } from "../types/drinksData";

export interface FetchDrinksParams {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchDrinks = async (params: FetchDrinksParams = {}): Promise<TDrinksData[]> => {
  const { category, page = 1, limit = 10, search } = params;

  const url = new URL('http://localhost:3333/drinks')

  if (category) {
    url.searchParams.set('category', category);
  }
  if (page) {
    url.searchParams.set('page', String(page));
  }
  if (limit) {
    url.searchParams.set('limit', String(limit));
  }
  if (search) {
    url.searchParams.set('search', search);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Erro ao buscar os drinks`);
  }

  const data = await response.json();
  return data.data.map((item: any) => ({
    ...item,
    id: item.id || item._id || item.name
  }));
}
