import { getRestaurantConfig, getProducts } from "@/lib/db";
import RestaurantMenu from "@/components/client/RestaurantMenu";

// Force dynamic so that config updates via admin are immediately visible
export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getRestaurantConfig();
  const products = await getProducts();

  return (
    <RestaurantMenu 
      initialConfig={config} 
      initialProducts={products} 
    />
  );
}
