// models/TemporaryCode.ts
import mongoose, { Schema, Document } from "mongoose";
const TemporaryCodeSchema = new Schema({
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
export default mongoose.model("TemporaryCode", TemporaryCodeSchema);
//# sourceMappingURL=TemporaryCode.js.map