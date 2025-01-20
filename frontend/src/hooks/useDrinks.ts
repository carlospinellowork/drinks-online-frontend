import { useQuery } from "@tanstack/react-query";

interface fetchDrinksParams {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

const fetchDrinks = async (params: fetchDrinksParams = {}) => {
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
  return data.data;
}

export const useDrinks = (params: fetchDrinksParams = {}) => {
  return useQuery({
    queryKey: ['drinks', params],
    queryFn: () => fetchDrinks(params),
    enabled: !!params.category || !!params.search,
  })
}