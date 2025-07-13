import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { CreateOrderDto } from '../../../common/dto/create-order.dto';
import { Order } from './order.schema';

@Controller('v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.ordersService.updateOrderStatus(id, status);
  }
}
