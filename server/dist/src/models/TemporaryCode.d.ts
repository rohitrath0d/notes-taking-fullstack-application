import mongoose, { Document } from "mongoose";
export interface ITemporaryCode extends Document {
    code: string;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
    createdAt: Date;
}
declare const _default: mongoose.Model<ITemporaryCode, {}, {}, {}, mongoose.Document<unknown, {}, ITemporaryCode, {}, {}> & ITemporaryCode & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TemporaryCode.d.ts.map