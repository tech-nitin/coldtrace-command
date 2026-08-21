import { Schema, model, Document } from "mongoose";

export interface ITelemetry extends Document {
  deviceId: string;
  shipmentId: string;
  temperature: number;
  humidity: number;
  healthIndex?: number;

  location?: {
    type: "Point";
    coordinates: [number, number];
  };

  timestamp: Date;
}

const TelemetrySchema = new Schema<ITelemetry>(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    shipmentId: {
      type: String,
      required: true,
      index: true,
    },

    temperature: {
      type: Number,
      required: true,
    },

    humidity: {
      type: Number,
      required: true,
    },

    healthIndex: {
      type: Number,
      default: 100,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Telemetry = model<ITelemetry>(
  "Telemetry",
  TelemetrySchema
);