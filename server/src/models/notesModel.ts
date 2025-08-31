import mongoose, { Schema, Document } from "mongoose";

export interface Note extends Document {
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<Note>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Note = mongoose.model<Note>("Note", noteSchema);

export default Note;