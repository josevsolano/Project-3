import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  email:    string;
  password: string;
  skills:   string[];
  needs:    string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type:     String,
    required: true,
    unique:   true,
    lowercase:true,
    trim:     true,
  },
  password: {
    type:     String,
    required: true,
  },
  skills: {
    type:    [String],
    default: [],
    validate: {
      validator: (arr: any[]): boolean => Array.isArray(arr),
      message:   'Skills must be an array of strings'
    }
  },
  needs: {
    type:    [String],
    default: [],
    validate: {
      validator: (arr: any[]): boolean => Array.isArray(arr),
      message:   'Needs must be an array of strings'
    }
  },
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
