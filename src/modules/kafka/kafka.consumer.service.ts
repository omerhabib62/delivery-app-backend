import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from '../v1/rides/ride.schema';
import { Order } from '../v1/orders/order.schema';
import { RidesGateway } from '../v1/rides/rides.gateway';
import { OrdersGateway } from '../v1/orders/orders.gateway';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(
    @InjectModel(Ride.name) private rideModel: Model<Ride>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private ridesGateway: RidesGateway,
    private ordersGateway: OrdersGateway,
    private clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    // Subscribe to topics
    this.clientKafka.subscribeToResponseOf('ride.created');
    this.clientKafka.subscribeToResponseOf('ride.updated');
    this.clientKafka.subscribeToResponseOf('order.created');
    this.clientKafka.subscribeToResponseOf('order.updated');

    // Wait for connection to be ready
    await this.clientKafka.connect();

    // Set up message handlers
    this.clientKafka.subscribeToPatterns([
      'ride.created',
      'ride.updated',
      'order.created',
      'order.updated',
    ]);

    // Handle messages based on pattern
    this.clientKafka.messageHandlers.set('ride.created', async (message) => {
      const data = JSON.parse(message.value.toString());
      this.ridesGateway.notifyRideUpdate(data._id, data);
    });

    this.clientKafka.messageHandlers.set('ride.updated', async (message) => {
      const data = JSON.parse(message.value.toString());
      this.ridesGateway.notifyRideUpdate(data._id, data);
    });

    this.clientKafka.messageHandlers.set('order.created', async (message) => {
      const data = JSON.parse(message.value.toString());
      this.ordersGateway.notifyOrderUpdate(data._id, data);
    });

    this.clientKafka.messageHandlers.set('order.updated', async (message) => {
      const data = JSON.parse(message.value.toString());
      this.ordersGateway.notifyOrderUpdate(data._id, data);
    });
  }
}
