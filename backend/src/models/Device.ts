// backend/src/models/Device.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  nodeId: string;         // e.g. "DEV-1001"
  name: string;           // e.g. "Cold Storage A Sensor"
  type: string;           // e.g. "ESP32", "SHT40", "LIS3DH"
  battery: number;        // e.g. 92
  signal: number;         // e.g. -68
  lastPing: string;       // e.g. "2 min ago"
  firmware: string;       // e.g. "v2.1.0"
  status: 'Online' | 'Warning' | 'Offline';
  tempHistory: number[];  // e.g. [4.1, 4.2, 4.3, 4.2]
  humidityHistory: number[];
}

const DeviceSchema: Schema = new Schema(
  {
    nodeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    battery: { type: Number, required: true },
    signal: { type: Number, required: true },
    lastPing: { type: String, default: 'Just now' },
    firmware: { type: String, default: 'v2.1.0' },
    status: { type: String, enum: ['Online', 'Warning', 'Offline'], default: 'Online' },
    tempHistory: { type: [Number], default: [4.0, 4.2, 4.1, 4.3] },
    humidityHistory: { type: [Number], default: [65, 68, 66, 67] }
  },
  { timestamps: true }
);

export default mongoose.model<IDevice>('Device', DeviceSchema);