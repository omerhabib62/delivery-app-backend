import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  restaurantId: string;

  @IsNotEmpty()
  @IsArray()
  items: { itemId: string; quantity: number }[];

  @IsNotEmpty()
  deliveryLocation: { lat: number; lng: number };
}
