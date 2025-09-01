import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  googleId?: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true, 
      // unique: true,
      trim: true,
    },
    password: {
      type: String,   // required only for local
      // required: true,
    },
    googleId: {
      type: String,   // added for Google OAuth
      default: null,
    },
    provider: { 
      type: String, 
      default: "local" 
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

const User = mongoose.model<User>("User", userSchema);

export default User;