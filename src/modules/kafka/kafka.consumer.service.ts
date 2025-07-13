import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from '../v1/rides/ride.schema';
import { Order } from '../v1/orders/order.schema';
import { RidesGateway } from '../v1/rides/rides.gateway';
import { OrdersGateway } from '../v1/orders/orders.gateway';
import { Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(
    @InjectModel(Ride.name) private rideModel: Model<Ride>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private ridesGateway: RidesGateway,
    private ordersGateway: OrdersGateway,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // No need to subscribe here; @MessagePattern handles subscriptions
    await this.kafkaClient.connect();
  }

  @MessagePattern('ride.created')
  handleRideCreated(@Payload() message: any) {
    const data = JSON.parse(message.value.toString());
    this.ridesGateway.notifyRideUpdate(data._id, data);
  }

  @MessagePattern('ride.updated')
  handleRideUpdated(@Payload() message: any) {
    const data = JSON.parse(message.value.toString());
    this.ridesGateway.notifyRideUpdate(data._id, data);
  }

  @MessagePattern('order.created')
  handleOrderCreated(@Payload() message: any) {
    const data = JSON.parse(message.value.toString());
    this.ordersGateway.notifyOrderUpdate(data._id, data);
  }

  @MessagePattern('order.updated')
  handleOrderUpdated(@Payload() message: any) {
    const data = JSON.parse(message.value.toString());
    this.ordersGateway.notifyOrderUpdate(data._id, data);
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }
}
