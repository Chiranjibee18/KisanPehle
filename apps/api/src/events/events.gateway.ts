import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_center')
  handleJoinCenter(client: Socket, centerId: string) {
    client.join(`center_${centerId}`);
    this.logger.log(`Client ${client.id} joined room center_${centerId}`);
    return { status: 'joined', room: `center_${centerId}` };
  }

  @SubscribeMessage('join_farmer')
  handleJoinFarmer(client: Socket, farmerId: string) {
    client.join(`farmer_${farmerId}`);
    this.logger.log(`Client ${client.id} joined room farmer_${farmerId}`);
    return { status: 'joined', room: `farmer_${farmerId}` };
  }

  // Broadcast helper methods
  emitQueueUpdated(centerId: string, payload: any) {
    if (this.server) {
      this.server.to(`center_${centerId}`).emit('queue.updated', payload);
      this.server.emit('global.queue.updated', { centerId, ...payload });
    }
  }

  emitProcurementTransition(farmerId: string, centerId: string, payload: any) {
    if (this.server) {
      this.server.to(`farmer_${farmerId}`).emit('procurement.status.changed', payload);
      this.server.to(`center_${centerId}`).emit('procurement.status.changed', payload);
      this.server.emit('global.procurement.updated', payload);
    }
  }

  emitCenterStatusChanged(centerId: string, payload: any) {
    if (this.server) {
      this.server.emit('center.status.changed', { centerId, ...payload });
    }
  }

  emitNotification(farmerId: string, payload: any) {
    if (this.server) {
      this.server.to(`farmer_${farmerId}`).emit('notification.created', payload);
    }
  }
}
