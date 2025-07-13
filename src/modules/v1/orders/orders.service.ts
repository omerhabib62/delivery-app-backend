import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { CreateOrderDto } from '../../../common/dto/create-order.dto';
import { KafkaProducerService } from 'src/modules/kafka/kafka.producer';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private kafkaProducerService: KafkaProducerService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel({
      ...createOrderDto,
      status: 'pending',
    });

    await order.save();

    // Emit Kafka event for order creation
    await this.kafkaProducerService.produce({
      topic: 'order.created',
      messages: [{ value: JSON.stringify(order) }],
    });

    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    await this.kafkaProducerService.produce({
      topic: 'order.updated',
      messages: [{ value: JSON.stringify(order) }],
    });
    return order;
  }
}
