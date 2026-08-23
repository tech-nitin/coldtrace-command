import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

class SocketService {
  private io: SocketIOServer | null = null;

  public init(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`[Socket] Client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
      });
    });

    console.log("[Socket] Socket.IO initialized");
  }

  public emitTelemetryUpdate(
    shipmentId: string,
    payload: Record<string, unknown>
  ): void {
    if (!this.io) {
      console.warn("[Socket] Socket.IO not initialized");
      return;
    }

    const data = {
      shipmentId,
      ...payload,
    };

    this.io.emit("telemetry_update", data);
    this.io.emit(`shipment:${shipmentId}`, data);

    console.log(
      `[Socket] Telemetry emitted for shipment ${shipmentId}`
    );
  }

  public emitAlert(
    shipmentId: string,
    alert: unknown
  ): void {
    if (!this.io) {
      console.warn("[Socket] Socket.IO not initialized");
      return;
    }

    this.io.emit("alert_triggered", {
      shipmentId,
      alert,
    });

    this.io.emit(`alert:${shipmentId}`, alert);

    console.log(
      `[Socket] Alert emitted for shipment ${shipmentId}`
    );
  }
}

export const socketService = new SocketService();