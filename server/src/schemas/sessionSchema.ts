import mongoose, { Schema, Document } from 'mongoose';
import ObjectId from 'mongoose';

export interface ISession extends Document {
    user: mongoose.Types.ObjectId;
    valid: boolean;
    userAgent: string;
}

const SessionSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        valid: { type: Boolean, default: true },
        userAgent: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ISession>('Session', SessionSchema);
