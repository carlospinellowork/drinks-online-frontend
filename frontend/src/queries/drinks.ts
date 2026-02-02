import { useQuery } from "@tanstack/react-query";
import { fetchDrinks, FetchDrinksParams } from "../api/drinks";

export const useGetDrinks = (params: FetchDrinksParams = {}) => {
  return useQuery({
    queryKey: ['drinks', params],
    queryFn: () => fetchDrinks(params),
    staleTime: 1000 * 60 * 5
  });
}
