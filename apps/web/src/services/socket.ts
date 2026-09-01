import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  init() {
    if (this.socket) return this.socket;

    const url = window.location.origin;
    this.socket = io(url, {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('⚡ Kisan Pehele Real-time Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('⚡ Kisan Pehele Real-time Socket disconnected');
    });

    return this.socket;
  }

  joinCenter(centerId: string) {
    if (this.socket) {
      this.socket.emit('join_center', centerId);
    }
  }

  joinFarmer(farmerId: string) {
    if (this.socket) {
      this.socket.emit('join_farmer', farmerId);
    }
  }

  onQueueUpdated(callback: (data: any) => void) {
    if (!this.socket) this.init();
    this.socket?.on('queue.updated', callback);
    this.socket?.on('global.queue.updated', callback);
  }

  onProcurementChanged(callback: (data: any) => void) {
    if (!this.socket) this.init();
    this.socket?.on('procurement.status.changed', callback);
    this.socket?.on('global.procurement.updated', callback);
  }

  onCenterStatusChanged(callback: (data: any) => void) {
    if (!this.socket) this.init();
    this.socket?.on('center.status.changed', callback);
  }

  onNotification(callback: (data: any) => void) {
    if (!this.socket) this.init();
    this.socket?.on('notification.created', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const socketService = new SocketService();
