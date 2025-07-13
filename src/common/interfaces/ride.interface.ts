export interface IRide {
  userId: string;
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  status: string;
  driverId?: string;
  distance?: number;
  estimatedTime?: number;
}
