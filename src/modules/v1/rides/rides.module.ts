import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RidesService } from './rides.service';
import { RidesGateway } from './rides.gateway';
import { Ride, RideSchema } from './ride.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
    KafkaModule,
  ],
  // controllers: [RidesController],
  providers: [RidesService, RidesGateway],
})
export class RidesModule {}
