import mongoose, { Schema, Document } from "mongoose";
const noteSchema = new Schema({
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
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
const Note = mongoose.model("Note", noteSchema);
export default Note;
//# sourceMappingURL=notesModel.js.map