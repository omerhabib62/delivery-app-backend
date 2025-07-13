import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ride extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  pickupLocation: { lat: number; lng: number };

  @Prop({ required: true })
  dropoffLocation: { lat: number; lng: number };

  @Prop({ required: true })
  status: string;

  @Prop()
  driverId?: string;

  @Prop()
  distance?: number;

  @Prop()
  estimatedTime?: number;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
