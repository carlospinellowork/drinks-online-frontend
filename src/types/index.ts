export type Product = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  availableDays_sunday?: boolean;
  availableDays_monday?: boolean;
  availableDays_tuesday?: boolean;
  availableDays_wednesday?: boolean;
  availableDays_thursday?: boolean;
  availableDays_friday?: boolean;
  availableDays_saturday?: boolean;
  category: string;
  photo?: string;
  price: string;
  sweetness?: number;         // 1-5 for Bartender quiz
  alcoholStrength?: number;   // 1-5 for Bartender quiz
  citric?: number;            // 1-5 for Bartender quiz
  alcoholBase?: string;       // gin, vodka, whisky, cachaça, sem-alcool, outro
}

export type RestaurantConfig = {
  name: string;
  description: string;
  address: string;
  whatsappNumber: string;
  instagramUrl: string;
  email: string;
  logoUrl?: string;
  bannerUrl?: string;
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  theme: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    borderRadius: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  deliveryNeighborhoods?: {
    name: string;
    fee: number;
  }[];
  coupons?: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }[];
  instagramPhotos?: string[];
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'table' | 'takeaway';
  tableNumber?: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
  };
  deliveryFee: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    photo?: string;
  }[];
  paymentMethod: string;
  couponCode?: string;
  discountValue: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

