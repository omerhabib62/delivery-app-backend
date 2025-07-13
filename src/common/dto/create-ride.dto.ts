import { IsNotEmpty } from 'class-validator';

export class CreateRideDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  pickupLocation: { lat: number; lng: number };

  @IsNotEmpty()
  dropoffLocation: { lat: number; lng: number };
}
