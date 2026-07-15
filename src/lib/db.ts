import fs from 'fs/promises';
import path from 'path';
import { Product, RestaurantConfig } from '@/types';

const configPath = path.join(process.cwd(), 'src/data/config.json');
const productsPath = path.join(process.cwd(), 'src/data/products.json');

export async function getRestaurantConfig(): Promise<RestaurantConfig> {
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading restaurant config, loading fallback:", error);
    // Fallback in case of read error
    return {
      name: "Faustino Drinks",
      description: "Seja bem-vindo ao Faustino Drinks.",
      address: "Endereço do restaurante",
      whatsappNumber: "5511957944402",
      instagramUrl: "https://instagram.com/faustinodrinks",
      email: "faustinodrinks@outlook.com",
      operatingHours: {
        weekdays: "Terça, Quarta e Quinta: 18:00 a 23:00",
        weekends: "Sexta, Sábado e Domingo: 18:00 a 01:00"
      },
      theme: {
        primary: "#436850",
        secondary: "#12372A",
        background: "#ffffff",
        foreground: "#09090b",
        borderRadius: "0.5rem"
      },
      categories: [
        { id: "drinks", name: "Drinks" },
        { id: "whiskeys", name: "Bebidas" },
        { id: "beers", name: "Cervejas" }
      ]
    };
  }
}

export async function saveRestaurantConfig(config: RestaurantConfig): Promise<void> {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products database:", error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8');
}
