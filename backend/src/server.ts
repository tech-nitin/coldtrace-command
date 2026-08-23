import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { socketService } from "./services/socket.service.js";
import Shipment from "./models/Shipment.js";

// Route imports
import telemetryRoutes from "./routes/telemetry.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mapRoutes from "./routes/map.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 5000;

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

/* =========================================
   SOCKET.IO INITIALIZATION
========================================= */

socketService.init(server);

/* =========================================
   ROUTES
========================================= */

app.use("/api/v1/shipments", shipmentRoutes);

app.use("/api/v1/telemetry", telemetryRoutes);

app.use("/api/v1/ai", aiRoutes);

app.use("/api/v1/ai-insights", aiRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/map", mapRoutes);

app.use("/api/v1/alerts", alertRoutes);

app.use("/api/v1/analytics", analyticsRoutes);

/* =========================================
   HEALTH CHECK
========================================= */

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "OK",
    system: "ChillChain API",
    socket: "enabled",
  });
});

/* =========================================
   DEFAULT SHIPMENT DATA
========================================= */

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

    aiRecommendation:
      "Inspect refrigeration system and prioritize delivery.",

    isDelayed: false,

    thresholds: {
      minTemp: 2.0,
      maxTemp: 8.0,
      maxHumidity: 85.0,
    },

    currentLocation: {
      type: "Point",
      coordinates: [72.8777, 19.076],
    },
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

    aiRecommendation:
      "Conditions are within the optimal range. No action required.",

    isDelayed: false,

    thresholds: {
      minTemp: 2.0,
      maxTemp: 10.0,
      maxHumidity: 80.0,
    },

    currentLocation: {
      type: "Point",
      coordinates: [75.8577, 22.7196],
    },
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

    aiRecommendation:
      "Monitor ambient temperature closely.",

    isDelayed: false,

    thresholds: {
      minTemp: 4.0,
      maxTemp: 8.0,
      maxHumidity: 75.0,
    },

    currentLocation: {
      type: "Point",
      coordinates: [77.4126, 23.2599],
    },
  },
];

/* =========================================
   DATABASE SEED
========================================= */

const seedIfEmpty = async () => {
  try {
    const count = await Shipment.countDocuments();

    if (count === 0) {
      await Shipment.insertMany(defaultShipments);

      console.log(
        "MongoDB was empty. Initial shipment data seeded successfully.",
      );
    } else {
      console.log(
        `MongoDB already contains ${count} shipment(s).`,
      );
    }
  } catch (error) {
    console.error(
      "[Database Seed Error]:",
      error,
    );
  }
};

/* =========================================
   START SERVER
========================================= */

const startServer = async () => {
  try {
    await connectDB();

    await seedIfEmpty();

    server.listen(PORT, () => {
      console.log("=================================");
      console.log("ChillChain Backend Started");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
      console.log("Socket.IO: Enabled");
      console.log("=================================");
    });
  } catch (error) {
    console.error(
      "[Server Startup Failed]:",
      error,
    );

    process.exit(1);
  }
};

startServer();