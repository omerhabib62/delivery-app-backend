import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinOrder')
  handleJoinOrder(@MessageBody() orderId: string, client: any): void {
    client.join(orderId);
    this.server
      .to(orderId)
      .emit('orderUpdate', { message: `User joined order ${orderId}` });
  }

  notifyOrderUpdate(orderId: string, update: any): void {
    this.server.to(orderId).emit('orderUpdate', update);
  }
}
