import dotenv from 'dotenv';
dotenv.config(); // MUST BE ON LINE 1 BEFORE ROUTE IMPORTS

import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { socketService } from './services/socket.service.js';
import Shipment from './models/Shipment.js';


// Route imports
import telemetryRoutes from './routes/telemetry.routes.js';
import authRoutes from './routes/auth.routes.js';
import mapRoutes from './routes/map.routes.js';
import alertRoutes from './routes/alert.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import aiRoutes from './routes/ai.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import riskSpoilageRoutes from './routes/riskSpoilage.routes.js';
import storageRoutes from './routes/storage.routes.js';
import deviceRoutes from './routes/device.routes.js';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Initialization
socketService.init(server);

// Routes
app.use('/api/v1/shipments', shipmentRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/map', mapRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/ai-insights', aiRoutes);
app.use('/api/v1', riskSpoilageRoutes);
app.use('/api/v1', storageRoutes);
app.use('/api/v1', deviceRoutes);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', system: 'ColdTrace API' });
});

const PORT = process.env.PORT || 5000;

// Default initial data if database is empty
const defaultShipments = [
  {
    shipmentId: "CG-10490",
    sensorDeviceId: "DEV-1001",
    cargoType: "Seafood",
    origin: "Mumbai",
    destination: "Pune",
    routeProgress: 55,
    currentTemp: 14.6,
    currentHumidity: 84,
    healthIndex: 41,
    eta: new Date(Date.now() + 75 * 60 * 1000),
    status: "CRITICAL",
    aiRiskLevel: "HIGH",
    aiRecommendation: "Inspect refrigeration system and prioritize delivery.",
    isDelayed: false,
    thresholds: { minTemp: 2.0, maxTemp: 8.0, maxHumidity: 85.0 },
    currentLocation: { type: "Point", coordinates: [72.8777, 19.0760] }
  },
  {
    shipmentId: "CG-10458",
    sensorDeviceId: "DEV-1002",
    cargoType: "Fruits",
    origin: "Indore",
    destination: "Bhopal",
    routeProgress: 64,
    currentTemp: 6.9,
    currentHumidity: 72,
    healthIndex: 92,
    eta: new Date(Date.now() + 160 * 60 * 1000),
    status: "HEALTHY",
    aiRiskLevel: "LOW",
    aiRecommendation: "Conditions are within optimal range. No action required.",
    isDelayed: false,
    thresholds: { minTemp: 2.0, maxTemp: 10.0, maxHumidity: 80.0 },
    currentLocation: { type: "Point", coordinates: [75.8577, 22.7196] }
  },
  {
    shipmentId: "CG-10431",
    sensorDeviceId: "DEV-1003",
    cargoType: "Vegetables",
    origin: "Bhopal",
    destination: "Jaipur",
    routeProgress: 38,
    currentTemp: 9.2,
    currentHumidity: 68,
    healthIndex: 68,
    eta: new Date(Date.now() + 185 * 60 * 1000),
    status: "AT_RISK",
    aiRiskLevel: "MEDIUM",
    aiRecommendation: "Monitor ambient temperature closely.",
    isDelayed: false,
    thresholds: { minTemp: 4.0, maxTemp: 8.0, maxHumidity: 75.0 },
    currentLocation: { type: "Point", coordinates: [77.4126, 23.2599] }
  }
];

const seedIfEmpty = async () => {
  try {
    const count = await Shipment.countDocuments();
    if (count === 0) {
      await Shipment.insertMany(defaultShipments);
      console.log('MongoDB empty: Automatically seeded initial shipments.');
    }
  } catch (err) {
    console.error('Error auto-seeding DB:', err);
  }
};

const cleanupProblematicIndexes = async () => {
  try {
    await mongoose.connection.collection('shipments').dropIndex('sensorDeviceId_1');
    console.log('Successfully removed duplicate sensorDeviceId_1 index.');
  } catch (err) {
    // Index already removed or non-existent
  }
};

connectDB().then(async () => {
  await cleanupProblematicIndexes();
  await seedIfEmpty();
  server.listen(PORT, () => {
    console.log(`ColdTrace Backend running on port ${PORT}`);
  });
});