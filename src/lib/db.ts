import { supabase } from './supabase';
import { Product, RestaurantConfig, Order, OrderStatus } from '@/types';

// Tenant identifier from Environment Variables
const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID || 'default';

// Fallback Instagram Photos
const DEFAULT_INSTAGRAM_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&h=400&q=80"
];

// Fallback configuration
const DEFAULT_CONFIG: RestaurantConfig = {
  name: "Faustino Drinks & Gourmet",
  description: "O melhor em drinks artesanais, petiscos e hambúrgueres gourmet. Peça online e receba na sua mesa ou em casa com total conforto!",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
  whatsappNumber: "5511957944402",
  instagramUrl: "https://instagram.com/faustinodrinks",
  email: "faustinodrinks@outlook.com",
  operatingHours: {
    weekdays: "Terça a Quinta: 18:00 a 23:00",
    weekends: "Sexta a Domingo: 18:00 a 01:00"
  },
  theme: {
    primary: "#436850",
    secondary: "#12372A",
    background: "#ffffff",
    foreground: "#09090b",
    borderRadius: "0.75rem"
  },
  categories: [
    { id: "drinks", name: "Drinks & Bebidas" },
    { id: "petiscos", name: "Petiscos & Porções" },
    { id: "comidas", name: "Burgers & Pratos" }
  ],
  deliveryNeighborhoods: [
    { name: "Centro", fee: 5.00 },
    { name: "Vila Nova", fee: 8.00 },
    { name: "Jardim América", fee: 10.00 }
  ],
  coupons: [
    { code: "BEMVINDO10", type: "percentage", value: 10, isActive: true },
    { code: "PRIMEIRO5", type: "fixed", value: 5, isActive: true }
  ],
  instagramPhotos: DEFAULT_INSTAGRAM_PHOTOS
};

// Fallback products (fully seeded with foods, drinks, and snacks from the web)
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "caipirinha-classica",
    name: "Caipirinha de Limão",
    description: "A clássica caipirinha brasileira com cachaça prata premium, limão fresco, açúcar e muito gelo triturado.",
    price: "18.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
    sweetness: 4,
    citric: 5,
    alcoholStrength: 3,
    alcoholBase: "cachaça",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "gin-frutas-vermelhas",
    name: "Gin Tônica Frutas Vermelhas",
    description: "Gin premium, água tônica gelada, infusão de morango, amora, mirtilo e bagas de zimbro.",
    price: "26.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80",
    sweetness: 2,
    citric: 4,
    alcoholStrength: 3,
    alcoholBase: "gin",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "whisky-sour",
    name: "Whisky Sour",
    description: "Whisky Bourbon, suco de limão siciliano espremido na hora, xarope de açúcar simples e espuma cremosa.",
    price: "28.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80",
    sweetness: 2,
    citric: 4,
    alcoholStrength: 4,
    alcoholBase: "whisky",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "cerveja-ipa",
    name: "Cerveja IPA Artesanal (500ml)",
    description: "Cerveja artesanal encorpada estilo India Pale Ale, lúpulo aromático com notas cítricas e amargor ideal.",
    price: "15.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1538256909204-a772737a7b84?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 2,
    alcoholStrength: 3,
    alcoholBase: "outro",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "suco-tropical",
    name: "Mocktail Tropical Sem Álcool",
    description: "Refrescante mix de maracujá, xarope de grenadine vermelha, abacaxi e soda limonada. 100% sem álcool.",
    price: "16.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=400&q=80",
    sweetness: 5,
    citric: 3,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "mojito-cubano",
    name: "Mojito de Hortelã Cubano",
    description: "Rum branco, folhas de hortelã frescas maceradas, suco de limão siciliano, água com gás e gelo.",
    price: "20.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
    sweetness: 3,
    citric: 4,
    alcoholStrength: 2,
    alcoholBase: "rum",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "margarita-classica",
    name: "Margarita Clássica",
    description: "Tequila premium, licor Triple Sec de laranja, suco de limão espremido e borda com sal fino.",
    price: "24.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=400&q=80",
    sweetness: 2,
    citric: 5,
    alcoholStrength: 4,
    alcoholBase: "outro",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "aperol-spritz",
    name: "Aperol Spritz",
    description: "Aperol, espumante prosecco, água gaseificada e uma fatia de laranja fresca. Leve e festivo.",
    price: "25.00",
    category: "drinks",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=400&q=80",
    sweetness: 3,
    citric: 3,
    alcoholStrength: 2,
    alcoholBase: "outro",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "batatas-rusticas",
    name: "Batatas Rústicas com Páprica",
    description: "Batatas fritas rústicas inteiras, temperadas com páprica defumada especial, alecrim fresco e maionese artesanal de alho.",
    price: "24.00",
    category: "petiscos",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "coxinhas-costela",
    name: "Coxinhas de Costela Cremosa (6 un)",
    description: "Coxinhas super crocantes sem massa recheadas inteiramente com costela bovina desfiada e catupiry legítimo.",
    price: "28.00",
    category: "petiscos",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "aneis-cebola",
    name: "Anéis de Cebola Empanados",
    description: "Cebola doce fatiada em anéis grossos, empanados em farinha Panko super crocante e servidos com barbecue caseiro.",
    price: "19.00",
    category: "petiscos",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "calabresa-cachaça",
    name: "Calabresa na Cachaça Acebolada",
    description: "Calabresa defumada fatiada, flambada na cachaça premium com cebolas e acompanhada de fatias de pão francês.",
    price: "34.00",
    category: "petiscos",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "croquetes-carne",
    name: "Croquetes de Carne de Panela (6 un)",
    description: "Croquetes macios de carne bovina temperada e cozida desfiada, empanados e fritos, servidos com mostarda escura.",
    price: "26.00",
    category: "petiscos",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "smash-classico",
    name: "Burger Smash Clássico",
    description: "Pão brioche amanteigado, blend Angus smash de 100g, queijo cheddar derretido, cebola roxa picada, picles artesanais e maionese especial.",
    price: "32.00",
    category: "comidas",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "burger-gorgonzola",
    name: "Burger Bacon & Gorgonzola",
    description: "Pão brioche, blend gourmet Angus de 150g, creme artesanal de gorgonzola, bacon crocante caramelizado e rúcula fresca.",
    price: "38.00",
    category: "comidas",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "crispy-chicken",
    name: "Crispy Chicken Burger",
    description: "Pão brioche, sobrecoxa de frango crocante empanada de 140g, alface americana picada, queijo prato e maionese verde.",
    price: "30.00",
    category: "comidas",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  },
  {
    id: "pizza-margherita",
    name: "Pizza Margherita Individual",
    description: "Massa artesanal de fermentação lenta (Napolitana), molho de tomate pomodoro, mozzarella fresca, manjericão e azeite.",
    price: "35.00",
    category: "comidas",
    isActive: true,
    photo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    sweetness: 1,
    citric: 1,
    alcoholStrength: 1,
    alcoholBase: "sem-alcool",
    availableDays_sunday: true,
    availableDays_monday: true,
    availableDays_tuesday: true,
    availableDays_wednesday: true,
    availableDays_thursday: true,
    availableDays_friday: true,
    availableDays_saturday: true
  }
];

// Helper: map DB config to TypeScript type
function mapDbConfig(dbConfig: any): RestaurantConfig {
  if (!dbConfig) return DEFAULT_CONFIG;
  return {
    name: dbConfig.name,
    description: dbConfig.description || '',
    address: dbConfig.address || '',
    whatsappNumber: dbConfig.whatsapp_number || '',
    instagramUrl: dbConfig.instagram_url || '',
    email: dbConfig.email || '',
    logoUrl: dbConfig.logo_url || undefined,
    bannerUrl: dbConfig.banner_url || undefined,
    operatingHours: dbConfig.operating_hours || DEFAULT_CONFIG.operatingHours,
    theme: dbConfig.theme || DEFAULT_CONFIG.theme,
    categories: dbConfig.categories || DEFAULT_CONFIG.categories,
    deliveryNeighborhoods: dbConfig.delivery_neighborhoods || [],
    coupons: dbConfig.coupons || [],
    instagramPhotos: dbConfig.instagram_photos || DEFAULT_INSTAGRAM_PHOTOS
  };
}

// Helper: map TypeScript config to DB format
function mapConfigToDb(config: RestaurantConfig) {
  return {
    name: config.name,
    description: config.description,
    address: config.address,
    whatsapp_number: config.whatsappNumber,
    instagram_url: config.instagramUrl,
    email: config.email,
    logo_url: config.logoUrl || null,
    banner_url: config.bannerUrl || null,
    operating_hours: config.operatingHours,
    theme: config.theme,
    categories: config.categories,
    delivery_neighborhoods: config.deliveryNeighborhoods || [],
    coupons: config.coupons || [],
    instagram_photos: config.instagramPhotos || DEFAULT_INSTAGRAM_PHOTOS
  };
}

// Helper: map DB product to TypeScript Product
function mapDbProduct(dbProd: any): Product {
  return {
    id: dbProd.id,
    name: dbProd.name,
    description: dbProd.description,
    price: dbProd.price,
    category: dbProd.category,
    isActive: dbProd.is_active,
    photo: dbProd.photo || undefined,
    sweetness: dbProd.sweetness,
    alcoholStrength: dbProd.alcohol_strength,
    citric: dbProd.citric,
    alcoholBase: dbProd.alcohol_base,
    availableDays_sunday: dbProd.available_days_sunday,
    availableDays_monday: dbProd.available_days_monday,
    availableDays_tuesday: dbProd.available_days_tuesday,
    availableDays_wednesday: dbProd.available_days_wednesday,
    availableDays_thursday: dbProd.available_days_thursday,
    availableDays_friday: dbProd.available_days_friday,
    availableDays_saturday: dbProd.available_days_saturday,
  };
}

// Helper: map Product to DB product
function mapProductToDb(prod: Product) {
  return {
    id: prod.id,
    name: prod.name,
    description: prod.description || null,
    price: prod.price,
    category: prod.category,
    is_active: prod.isActive !== undefined ? prod.isActive : true,
    photo: prod.photo || null,
    sweetness: prod.sweetness !== undefined ? prod.sweetness : 3,
    alcohol_strength: prod.alcoholStrength !== undefined ? prod.alcoholStrength : 3,
    citric: prod.citric !== undefined ? prod.citric : 3,
    alcohol_base: prod.alcoholBase || 'sem-alcool',
    available_days_sunday: prod.availableDays_sunday !== undefined ? prod.availableDays_sunday : true,
    available_days_monday: prod.availableDays_monday !== undefined ? prod.availableDays_monday : true,
    available_days_tuesday: prod.availableDays_tuesday !== undefined ? prod.availableDays_tuesday : true,
    available_days_wednesday: prod.availableDays_wednesday !== undefined ? prod.availableDays_wednesday : true,
    available_days_thursday: prod.availableDays_thursday !== undefined ? prod.availableDays_thursday : true,
    available_days_friday: prod.availableDays_friday !== undefined ? prod.availableDays_friday : true,
    available_days_saturday: prod.availableDays_saturday !== undefined ? prod.availableDays_saturday : true,
  };
}

export async function getRestaurantConfig(): Promise<RestaurantConfig> {
  try {
    const { data, error } = await supabase
      .from('restaurant_config')
      .select('*')
      .eq('id', restaurantId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return DEFAULT_CONFIG;
    return mapDbConfig(data);
  } catch (error) {
    console.error("Error fetching config from Supabase:", error);
    return DEFAULT_CONFIG;
  }
}

export async function saveRestaurantConfig(config: RestaurantConfig): Promise<void> {
  const dbData = mapConfigToDb(config);
  const { error } = await supabase
    .from('restaurant_config')
    .upsert({ id: restaurantId, ...dbData });
  
  if (error) {
    console.error("Error saving config to Supabase:", error);
    throw error;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('name', { ascending: true });

    if (error) throw error;
    
    // Auto-seeding: If default restaurant and DB has fewer than 12 products, seed the rest
    if (restaurantId === 'default' && (!data || data.length < 12)) {
      console.log(`Auto-seeding: Only ${data ? data.length : 0} items found in DB. Seeding all 17 premium menu items...`);
      const mappedSeeds = DEFAULT_PRODUCTS.map(prod => ({
        ...mapProductToDb(prod),
        restaurant_id: 'default'
      }));

      const { error: upsertError } = await supabase
        .from('products')
        .upsert(mappedSeeds);

      if (!upsertError) {
        const { data: seededData, error: reQueryError } = await supabase
          .from('products')
          .select('*')
          .eq('restaurant_id', 'default')
          .order('name', { ascending: true });

        if (!reQueryError && seededData && seededData.length > 0) {
          return seededData.map(mapDbProduct);
        }
      } else {
        console.error("Auto-seeding failed:", upsertError);
      }
    }

    if ((!data || data.length === 0) && restaurantId === 'default') {
      return DEFAULT_PRODUCTS;
    }

    return (data || []).map(mapDbProduct);
  } catch (error) {
    console.error("Error fetching products from Supabase:", error);
    if (restaurantId === 'default') {
      return DEFAULT_PRODUCTS;
    }
    return [];
  }
}

export async function createProduct(product: Product): Promise<Product> {
  const dbData = mapProductToDb(product);
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...dbData,
      restaurant_id: restaurantId
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating product in Supabase:", error);
    throw error;
  }
  return mapDbProduct(data);
}

export async function updateProduct(product: Product): Promise<Product> {
  const dbData = mapProductToDb(product);
  const { data, error } = await supabase
    .from('products')
    .upsert({
      ...dbData,
      restaurant_id: restaurantId
    })
    .select()
    .single();

  if (error) {
    console.error("Error updating product in Supabase:", error);
    throw error;
  }
  return mapDbProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('restaurant_id', restaurantId);

  if (error) {
    console.error("Error deleting product from Supabase:", error);
    throw error;
  }
}

// Order Database Functions
export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map((dbOrder: any) => ({
      id: dbOrder.id,
      customerName: dbOrder.customer_name,
      customerPhone: dbOrder.customer_phone,
      orderType: dbOrder.order_type,
      tableNumber: dbOrder.table_number || undefined,
      address: dbOrder.address || undefined,
      deliveryFee: Number(dbOrder.delivery_fee),
      items: dbOrder.items,
      paymentMethod: dbOrder.payment_method,
      couponCode: dbOrder.coupon_code || undefined,
      discountValue: Number(dbOrder.discount_value),
      subtotal: Number(dbOrder.subtotal),
      total: Number(dbOrder.total),
      status: dbOrder.status as OrderStatus,
      createdAt: dbOrder.created_at
    }));
  } catch (error) {
    console.error("Error fetching orders from Supabase:", error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('restaurant_id', restaurantId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      orderType: data.order_type,
      tableNumber: data.table_number || undefined,
      address: data.address || undefined,
      deliveryFee: Number(data.delivery_fee),
      items: data.items,
      paymentMethod: data.payment_method,
      couponCode: data.coupon_code || undefined,
      discountValue: Number(data.discount_value),
      subtotal: Number(data.subtotal),
      total: Number(data.total),
      status: data.status as OrderStatus,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error(`Error fetching order ${id} from Supabase:`, error);
    return null;
  }
}

export async function createOrder(order: Order): Promise<Order> {
  const dbData = {
    id: order.id,
    restaurant_id: restaurantId,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    order_type: order.orderType,
    table_number: order.tableNumber || null,
    address: order.address || null,
    delivery_fee: order.deliveryFee,
    items: order.items,
    payment_method: order.paymentMethod,
    coupon_code: order.couponCode || null,
    discount_value: order.discountValue,
    subtotal: order.subtotal,
    total: order.total,
    status: order.status,
    created_at: order.createdAt
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error("Error creating order in Supabase:", error);
    throw error;
  }

  return {
    id: data.id,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    orderType: data.order_type,
    tableNumber: data.table_number || undefined,
    address: data.address || undefined,
    deliveryFee: Number(data.delivery_fee),
    items: data.items,
    paymentMethod: data.payment_method,
    couponCode: data.coupon_code || undefined,
    discountValue: Number(data.discount_value),
    subtotal: Number(data.subtotal),
    total: Number(data.total),
    status: data.status as OrderStatus,
    createdAt: data.created_at
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .eq('restaurant_id', restaurantId);

  if (error) {
    console.error(`Error updating status for order ${id} to ${status}:`, error);
    throw error;
  }
}
