import { Request, Response } from 'express';
import {Telemetry} from '../models/Telemetry.js';
import Shipment from '../models/Shipment.js';
import { calculateCargoHealth } from '../utils/healthCalculator.js';
import { socketService } from '../services/socket.service.js';

export const ingestTelemetry = async (req: Request, res: Response) => {
  try {
    const { deviceId, temperature, humidity, latitude, longitude } = req.body;

    const shipment = await Shipment.findOne({ sensorDeviceId: deviceId });
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Device not registered to shipment' });
    }

    const { healthIndex, status, aiRiskLevel } = calculateCargoHealth(
      temperature,
      humidity,
      shipment.thresholds
    );

    const telemetry = await Telemetry.create({
      shipmentId: shipment.shipmentId,
      timestamp: new Date(),
      temperature,
      humidity,
      healthIndex,
      location: { type: 'Point', coordinates: [longitude, latitude] },
    });

    shipment.status = status;
    shipment.aiRiskLevel = aiRiskLevel;
    shipment.currentLocation = { type: 'Point', coordinates: [longitude, latitude] };
    await shipment.save();

    const livePayload = {
      shipmentId: shipment.shipmentId,
      temperature,
      humidity,
      healthIndex,
      status,
      aiRiskLevel,
      location: [longitude, latitude],
      timestamp: telemetry.timestamp,
    };

    socketService.emitTelemetryUpdate(shipment.shipmentId, livePayload);

    res.status(201).json({ success: true, data: telemetry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};