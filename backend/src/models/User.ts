import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['ADMIN', 'DRIVER', 'AUDITOR'], 
      default: 'DRIVER' 
    },
  },
  { timestamps: true }
);

export const User = model('User', UserSchema);