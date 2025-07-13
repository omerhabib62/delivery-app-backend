import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RidesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRide')
  handleJoinRide(@MessageBody() rideId: string, client: any): void {
    client.join(rideId);
    this.server
      .to(rideId)
      .emit('rideUpdate', { message: `User joined ride ${rideId}` });
  }

  notifyRideUpdate(rideId: string, update: any): void {
    this.server.to(rideId).emit('rideUpdate', update);
  }
}
