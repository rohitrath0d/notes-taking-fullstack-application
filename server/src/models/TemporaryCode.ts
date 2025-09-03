// models/TemporaryCode.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITemporaryCode extends Document {
  code: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const TemporaryCodeSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Create index for automatic expiration
TemporaryCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ITemporaryCode>("TemporaryCode", TemporaryCodeSchema);