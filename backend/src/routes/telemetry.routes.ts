import { Router, Request, Response } from 'express';
import {Telemetry} from '../models/Telemetry.js'; // Default import (no braces)
import Shipment from '../models/Shipment.js';   // Default import (no braces)
import { evaluateTelemetryAlerts } from '../services/alert.service.js';
import { calculateCargoHealth } from '../utils/healthCalculator.js';
import { socketService } from '../services/socket.service.js';

const router = Router();

const handleIngest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId, shipmentId, temperature, humidity, location, latitude, longitude } = req.body;

    const activeShipmentId = shipmentId || "CG-10490";
    
    // Check if Shipment model exists before querying
    const shipment = Shipment ? await Shipment.findOne({ shipmentId: activeShipmentId }) : null;

    const thresholds = shipment?.thresholds || { maxTemp: 8.0, minTemp: 2.0, maxHumidity: 80 };
    const { healthIndex, status, aiRiskLevel } = calculateCargoHealth(temperature, humidity, thresholds);

    const coords = location?.coordinates || [longitude || 73.8567, latitude || 18.5204];

    // 1. Save telemetry
    const telemetry = await Telemetry.create({
      deviceId,
      shipmentId: activeShipmentId,
      temperature,
      humidity,
      healthIndex,
      location: { type: 'Point', coordinates: coords },
    });

    // 2. Evaluate alert triggers safely
    let triggeredAlert = null;
    if (typeof evaluateTelemetryAlerts === 'function') {
      triggeredAlert = await evaluateTelemetryAlerts(deviceId, activeShipmentId, temperature, humidity);
    }

    // 3. Update Shipment document status
    if (shipment) {
      shipment.status = status;
      shipment.aiRiskLevel = aiRiskLevel;
      shipment.currentLocation = { type: 'Point', coordinates: coords };
      await shipment.save();
    }

    // 4. Broadcast live Socket.io payload to React UI
    const livePayload = {
      shipmentId: activeShipmentId,
      temperature,
      humidity,
      healthIndex,
      status,
      aiRiskLevel,
      location: coords,
      timestamp: telemetry.timestamp,
    };
    socketService.emitTelemetryUpdate(activeShipmentId, livePayload);

    res.status(201).json({
      success: true,
      data: telemetry,
      alert: triggeredAlert || null,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

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