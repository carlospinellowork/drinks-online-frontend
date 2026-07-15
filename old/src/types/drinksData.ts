export type TDrinksData = {
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