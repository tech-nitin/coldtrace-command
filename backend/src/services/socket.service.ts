import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

class SocketService {
  private io: SocketIOServer | null = null;

  public init(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: { origin: '*' },
    });

    this.io.on('connection', (socket) => {
      console.log(`[Socket] Client connected: ${socket.id}`);
      
      socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
      });
    });
  }

  public emitTelemetryUpdate(shipmentId: string, payload: object): void {
    if (this.io) {
      this.io.emit('telemetry:update', { shipmentId, ...payload });
      this.io.emit(`shipment:${shipmentId}`, payload);
    }
  }
}

export const socketService = new SocketService();