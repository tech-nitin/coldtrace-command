import Shipment from '../models/Shipment.js';
import { Telemetry } from '../models/Telemetry.js';

export class ShipmentService {
  async getDashboardMetrics() {
    const total = await Shipment.countDocuments();
    const inTransit = await Shipment.countDocuments({ status: 'HEALTHY' });
    const atRiskCount = await Shipment.countDocuments({ status: 'AT_RISK' });
    const criticalCount = await Shipment.countDocuments({ status: 'CRITICAL' });
    const delayedCount = await Shipment.countDocuments({ isDelayed: true });

    return {
      totalShipments: total,
      inTransit,
      atRiskCount,
      criticalCount,
      delayedCount,
      sensorNetwork: { online: total, total },
      streamingStatus: 'Streaming',
    };
  }

  async getFilteredShipments(status?: string, search?: string) {
    const query: any = {};

    // Map UI tabs to backend status strings
    if (status && status.toUpperCase() !== 'ALL') {
      const formattedStatus = status.toUpperCase();
      if (formattedStatus === 'ACTIVE' || formattedStatus === 'IN_TRANSIT') {
        query.status = 'HEALTHY';
      } else {
        query.status = formattedStatus;
      }
    }

    if (search) {
      query.$or = [
        { shipmentId: { $regex: search, $options: 'i' } },
        { cargoType: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
      ];
    }

    return await Shipment.find(query).sort({ updatedAt: -1 });
  }

  async getShipmentDetails(shipmentId: string) {
    const shipment = await Shipment.findOne({ shipmentId });
    if (!shipment) throw new Error('Shipment not found');

    // Return recent telemetry points for the side panel line graph
    const telemetryHistory = await Telemetry.find({ shipmentId })
      .sort({ timestamp: -1 })
      .limit(10);

    return {
      shipment,
      latestTelemetry: telemetryHistory[0] || null,
      sensorTrend: telemetryHistory.reverse(),
    };
  }
}