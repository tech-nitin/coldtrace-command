import { Schema, model, Document } from 'mongoose';

export interface ITelemetry extends Document {
  deviceId: string;
  shipmentId: string;
  temperature: number;
  humidity: number;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  timestamp: Date;
}

const TelemetrySchema = new Schema<ITelemetry>(
  {
    deviceId: { type: String, required: true, index: true },
    shipmentId: { type: String, required: true, index: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] },
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timeseries: { timeField: 'timestamp', metaField: 'deviceId', granularity: 'seconds' } }
);

export const Telemetry = model<ITelemetry>('Telemetry', TelemetrySchema);