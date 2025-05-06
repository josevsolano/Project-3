import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const tutorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
  });

// Add a method to compare passwords
tutorSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export interface ITutor extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    skills: string[];
    isCorrectPassword(password: string): Promise<boolean>;
}

const Tutor = mongoose.model<ITutor>('Tutor', tutorSchema);
export default Tutor;