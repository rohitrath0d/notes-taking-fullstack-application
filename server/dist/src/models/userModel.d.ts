import mongoose, { Document } from "mongoose";
export interface User extends Document {
    name: string;
    email: string;
    password: string;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User, {}, {}> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=userModel.d.ts.map