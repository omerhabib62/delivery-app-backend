import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaConsumerService } from './kafka.consumer.service';
import { kafkaConfig } from '../../config/kafka.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RidesModule } from '../v1/rides/rides.module';
import { OrdersModule } from '../v1/orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from '../v1/rides/ride.schema';
import { Order, OrderSchema } from '../v1/orders/order.schema';
import { KafkaProducerService } from './kafka.producer';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: kafkaConfig,
        inject: [ConfigService],
      },
    ]),
    RidesModule,
    OrdersModule,
    MongooseModule.forFeature([
      { name: Ride.name, schema: RideSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
