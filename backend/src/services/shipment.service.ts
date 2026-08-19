import Shipment from '../models/Shipment.js';
import Telemetry from '../models/Telemetry.js';

export class ShipmentService {
  async getDashboardMetrics() {
    const activeShipments = await Shipment.countDocuments();
    const criticalCount = await Shipment.countDocuments({ status: 'CRITICAL' });
    const atRiskCount = await Shipment.countDocuments({ status: 'AT_RISK' });

    return {
      activeShipments,
      criticalCount,
      atRiskCount,
      sensorNetwork: { online: activeShipments, total: activeShipments },
      streamingStatus: 'Streaming',
    };
  }

  async getFilteredShipments(status?: string, search?: string) {
    const query: any = {};

    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { shipmentId: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
      ];
    }

    return await Shipment.find(query).sort({ updatedAt: -1 });
  }

  async getShipmentDetails(shipmentId: string) {
    const shipment = await Shipment.findOne({ shipmentId });
    if (!shipment) throw new Error('Shipment not found');

    const latestTelemetry = await Telemetry.findOne({ shipmentId })
      .sort({ timestamp: -1 });

    return { shipment, latestTelemetry };
  }
}