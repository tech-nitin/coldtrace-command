import { Router, Request, Response } from 'express';

import { Telemetry } from '../models/Telemetry.js';
import Shipment from '../models/Shipment.js';

import { evaluateTelemetryAlerts } from '../services/alert.service.js';
import { calculateCargoHealth } from '../utils/healthCalculator.js';
import { socketService } from '../services/socket.service.js';

const router = Router();

const handleIngest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      deviceId,
      shipmentId,
      temperature,
      humidity,
      location,
      latitude,
      longitude,
    } = req.body;

    // Use provided shipment ID or fallback ID
    const activeShipmentId = shipmentId || 'CG-10490';

    // 1. Find shipment
    const shipment = await Shipment.findOne({
      shipmentId: activeShipmentId,
    });

    // Shipment temperature thresholds
    const thresholds = shipment?.thresholds || {
      minTemp: 2.0,
      maxTemp: 8.0,
      maxHumidity: 80,
    };

    // 2. Calculate cargo health
    const { healthIndex, status, aiRiskLevel } =
      calculateCargoHealth(
        temperature,
        humidity,
        thresholds
      );

    // 3. Get location coordinates
    const coords =
      location?.coordinates ??
      [
        longitude ?? 73.8567,
        latitude ?? 18.5204,
      ];

    // 4. Save telemetry data
    const telemetry = await Telemetry.create({
      deviceId,
      shipmentId: activeShipmentId,
      temperature,
      humidity,
      healthIndex,
      location: {
        type: 'Point',
        coordinates: coords,
      },
    });

    // 5. Update shipment with normal health status
    if (shipment) {
      shipment.status = status;
      shipment.aiRiskLevel = aiRiskLevel;

      shipment.currentLocation = {
        type: 'Point',
        coordinates: coords,
      };

      await shipment.save();
    }

    // 6. Check for temperature alerts
    const triggeredAlert =
      await evaluateTelemetryAlerts(
        deviceId,
        activeShipmentId,
        temperature,
        humidity
      );

      if (triggeredAlert) {
  socketService.emitAlert(
    activeShipmentId,
    triggeredAlert
  );
}

    // If an alert is triggered, shipment status becomes CRITICAL
    const finalStatus = triggeredAlert
      ? 'CRITICAL'
      : status;

    // 7. Prepare real-time payload
    const livePayload = {
      shipmentId: activeShipmentId,
      temperature,
      humidity,
      healthIndex,
      status: finalStatus,
      aiRiskLevel,
      location: coords,
      timestamp: telemetry.timestamp,
      alert: triggeredAlert,
    };

    // 8. Send real-time update through Socket.IO
    socketService.emitTelemetryUpdate(
      activeShipmentId,
      livePayload
    );

    // 9. Send API response
    res.status(201).json({
      success: true,
      data: telemetry,
      alert: triggeredAlert || null,
    });
  } catch (err: any) {
    console.error(
      '[Telemetry Ingest Error]',
      err
    );

    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// Support both routes
router.post('/', handleIngest);
router.post('/ingest', handleIngest);
// GET historical temperature trajectory for Analytics graph
router.get('/history/:shipmentId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { shipmentId } = req.params;
    
    // Fetch last 30 telemetry points sorted by timestamp ascending
    const records = await Telemetry.find({ shipmentId })
      .sort({ timestamp: 1 })
      .limit(30);

    const formattedData = records.map((t) => ({
      time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: t.temperature,
      humidity: t.humidity,
      healthIndex: t.healthIndex
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;