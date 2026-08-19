import { Schema, model, Document } from 'mongoose';

export interface IAlert extends Document {
  shipmentId: string;
  deviceId: string;
  alertType: 'TEMP_EXCEEDED' | 'TEMP_TOO_LOW' | 'HUMIDITY_BREACH' | 'AI_HAZARD';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  readingValue: number;
  thresholdLimit: number;
  status: 'ACTIVE' | 'RESOLVED';
  resolvedAt?: Date;
  resolvedBy?: string;
  timestamp: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    shipmentId: { type: String, required: true, index: true },
    deviceId: { type: String, required: true },
    alertType: {
      type: String,
      enum: ['TEMP_EXCEEDED', 'TEMP_TOO_LOW', 'HUMIDITY_BREACH', 'AI_HAZARD'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
    },
    message: { type: String, required: true },
    readingValue: { type: Number, required: true },
    thresholdLimit: { type: Number, required: true },
    status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' },
    resolvedAt: { type: Date },
    resolvedBy: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Alert = model<IAlert>('Alert', AlertSchema);