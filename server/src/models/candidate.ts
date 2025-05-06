import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface ICandidate extends Document {
  email: string;
  password: string;
  confirmPassword?: string; // Optional, typically used for validation during signup
  skills: string[];
  needs: string[];
  user: Types.ObjectId; // Reference to the User collection
  isCorrectPassword(password: string): Promise<boolean>;
}

const CandidateSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: [{ type: String }],
    needs: [{ type: String }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Add user as ObjectId
  },
  { timestamps: true }
);

CandidateSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Hash the password before saving the candidate
CandidateSchema.pre<ICandidate>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  }
  next();
});

const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);
export default Candidate;
