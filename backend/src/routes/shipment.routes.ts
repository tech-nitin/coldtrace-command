import { Router, Request, Response } from 'express';
import Shipment from '../models/Shipment';

const router = Router();

// GET all shipments
router.get('/', async (req: Request, res: Response) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// POST create new shipment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { shipmentId, cargo, cargoType, origin, destination, tempLimit, humidityLimit } = req.body;

    const itemCargo = cargo || cargoType || 'General';

    // Add sensorDeviceId inside your POST route payload
const newShipment = new Shipment({
  shipmentId: shipmentId || `CG-${Math.floor(10000 + Math.random() * 90000)}`,
  sensorDeviceId: `SNS-${Math.floor(1000 + Math.random() * 9000)}`, // Unique Sensor ID
  cargo: itemCargo,
  cargoType: itemCargo,
  origin: origin || 'Unknown',
  destination: destination || 'Unknown',
  tempLimit: tempLimit ? `${tempLimit}°C` : '2-8°C',
  humidityLimit: humidityLimit ? `${humidityLimit}%` : '60-80%',
  currentTemp: Number(tempLimit) || 4.5,
  currentHumidity: Number(humidityLimit) || 65.0,
  healthIndex: 100,
  status: 'HEALTHY',
  aiRiskLevel: 'low',
});

    const savedShipment = await newShipment.save();
    return res.status(201).json(savedShipment);
  } catch (error: any) {
    console.error('SERVER SAVE ERROR:', error);
    return res.status(400).json({ error: error.message || 'Error saving shipment' });
  }
});

export default router;