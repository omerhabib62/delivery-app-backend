import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { NotImplementedException } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      await this.jwtService.verifyAsync(token);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Handle client disconnection if needed
    throw new NotImplementedException(
      'Disconnect handling not implemented',
      client.id,
    );
  }

  @SubscribeMessage('joinOrder')
  handleJoinOrder(@MessageBody() orderId: string, client: Socket): void {
    client.join(orderId);
    this.server
      .to(orderId)
      .emit('orderUpdate', { message: `User joined order ${orderId}` });
  }

  notifyOrderUpdate(orderId: string, update: any): void {
    this.server.to(orderId).emit('orderUpdate', update);
  }
}
