import mongoose, { Schema, Document } from 'mongoose';

export interface IContactRequest extends Document {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}

const contactRequestSchema = new Schema<IContactRequest>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IContactRequest>('ContactRequest', contactRequestSchema);