export interface IOrder {
  userId: string;
  restaurantId: string;
  items: { itemId: string; quantity: number }[];
  deliveryLocation: { lat: number; lng: number };
  status: string;
  driverId?: string;
}
