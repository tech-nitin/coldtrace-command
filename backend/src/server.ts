import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { socketService } from './services/socket.service.js';

// Route imports
import telemetryRoutes from './routes/telemetry.routes.js';
import authRoutes from './routes/auth.routes.js';
import mapRoutes from './routes/map.routes.js';
import alertRoutes from './routes/alert.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import aiRoutes from './routes/ai.routes.js'; // Added AI routes

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Initialization
socketService.init(server);

// Routes
app.use('/api/v1/shipments', shipmentRoutes);
app.use('/api/v1/telemetry', telemetryRoutes); // Route handler for /ingest
app.use('/api/v1/ai', aiRoutes);                 // Route handler for AI insights
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/map', mapRoutes);
app.use('/api/v1/alerts', alertRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', system: 'ColdTrace API' });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start HTTP server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`ColdTrace Backend running on port ${PORT}`);
  });
});