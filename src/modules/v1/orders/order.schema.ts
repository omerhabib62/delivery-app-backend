import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  restaurantId: string;

  @Prop({ required: true })
  items: { itemId: string; quantity: number }[];

  @Prop({ required: true })
  deliveryLocation: { lat: number; lng: number };

  @Prop({ required: true })
  status: string;

  @Prop()
  driverId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
