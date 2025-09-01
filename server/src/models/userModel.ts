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
      type: String,   // required only for local accounts/normal sign up accounts
      // required: true,
    },
    googleId: {
      type: String,   // added for Google OAuth
      unique: true, 
      sparse: true, // allows multiple null values  
      default: null,
    },
    provider: { 
      type: String, 
      enum: ["local", "google", "both"], 
      default: "local" 
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

const User = mongoose.model<User>("User", userSchema);

// Conditional validation: password required only if provider = "local"
// If provider is "local" → password must exist.
// If provider is "google" → password is ignored.
// If provider is "both" → password is still present from local signup, and googleId is linked.
// Users marked as "both" already have a password from their local signup, so validation passes even though they also have googleId linked.
userSchema.pre("validate", function (next) {
  if (this.provider === "local" && !this.password) {
    this.invalidate("password", "Password is required for local accounts");
  }
  next();
});

export default User;