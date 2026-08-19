import { Schema, model, Document } from 'mongoose';

export interface IShipment extends Document {
  shipmentId: string;
  cargoType: string;
  origin: string;
  destination: string;
  status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
  aiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  eta: Date;
  sensorDeviceId: string;
  currentLocation: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };
  thresholds: {
    maxTemp: number;
    minTemp: number;
    maxHumidity: number;
  };
}

const shipmentSchema = new Schema<IShipment>(
  {
    shipmentId: { type: String, required: true, unique: true },
    cargoType: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    status: { type: String, enum: ['HEALTHY', 'AT_RISK', 'CRITICAL'], default: 'HEALTHY' },
    aiRiskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    eta: { type: Date, required: true },
    sensorDeviceId: { type: String, required: true, unique: true },
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    thresholds: {
      maxTemp: { type: Number, required: true },
      minTemp: { type: Number, required: true },
      maxHumidity: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

shipmentSchema.index({ currentLocation: '2dsphere' });

export default model<IShipment>('Shipment', shipmentSchema);