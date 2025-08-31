import mongoose, { Schema, Document } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        default: null,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=userModel.js.map