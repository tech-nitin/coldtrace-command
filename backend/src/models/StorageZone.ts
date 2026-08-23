// backend/src/models/StorageZone.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IStorageZone extends Document {
  zoneId: string; // e.g. "Storage Zone A"
  category: string; // e.g. "Fresh Vegetables", "Dairy Products"
  temperature: number; // e.g. 4.2
  humidity: number; // e.g. 72
  spoilageRisk: number; // e.g. 14 (out of 100)
  status: 'Healthy' | 'Warning' | 'Critical';
  sparklineData: number[]; // e.g. [12, 14, 13, 15, 14]
  exposureTime?: string; // e.g. "2h 18m"
  productSensitivity?: 'Low' | 'Medium' | 'High';
  recommendedAction?: string;
}

const StorageZoneSchema: Schema = new Schema(
  {
    zoneId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    spoilageRisk: { type: Number, required: true },
    status: { type: String, enum: ['Healthy', 'Warning', 'Critical'], default: 'Healthy' },
    sparklineData: { type: [Number], default: [10, 12, 11, 14, 13] },
    exposureTime: { type: String, default: '0h 0m' },
    productSensitivity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    recommendedAction: { type: String, default: 'No action required.' }
  },
  { timestamps: true }
);

export default mongoose.model<IStorageZone>('StorageZone', StorageZoneSchema);