import mongoose, { Schema } from 'mongoose';

const ShipmentSchema: Schema = new Schema(
  {
    shipmentId: { type: String, required: true },
    cargo: { type: String },
    cargoType: { type: String },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    tempLimit: { type: String },
    humidityLimit: { type: String },
    currentTemp: { type: Number, default: 4.5 },
    currentHumidity: { type: Number, default: 65.0 },
    healthIndex: { type: Number, default: 100 },
    status: { type: String, default: 'HEALTHY' },
    aiRiskLevel: { type: String, default: 'low' },
  },
  { timestamps: true }
);

export default mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema);