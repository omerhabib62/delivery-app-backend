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
export class RidesGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  @SubscribeMessage('joinRide')
  handleJoinRide(@MessageBody() rideId: string, client: Socket): void {
    client.join(rideId);
    this.server
      .to(rideId)
      .emit('rideUpdate', { message: `User joined ride ${rideId}` });
  }

  notifyRideUpdate(rideId: string, update: any): void {
    this.server.to(rideId).emit('rideUpdate', update);
  }
}
