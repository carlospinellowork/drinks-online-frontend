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
}
