import { Suspense } from 'react';
import { getRestaurantConfig, getProducts } from "@/lib/db";
import RestaurantMenu from "@/components/client/RestaurantMenu";

// Force dynamic so that config updates via admin are immediately visible
export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getRestaurantConfig();
  const products = await getProducts();

  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background text-foreground gap-3">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Carregando cardápio...</p>
      </div>
    }>
      <RestaurantMenu 
        initialConfig={config} 
        initialProducts={products} 
      />
    </Suspense>
  );
}
