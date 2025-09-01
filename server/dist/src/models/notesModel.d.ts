import mongoose, { Document } from "mongoose";
export interface Note extends Document {
    title: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Note: mongoose.Model<Note, {}, {}, {}, mongoose.Document<unknown, {}, Note, {}, {}> & Note & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Note;
//# sourceMappingURL=notesModel.d.ts.map