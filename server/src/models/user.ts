<<<<<<< HEAD
// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
    validate: arr => Array.isArray(arr),
  },
  needs: {
    type: [String],
    default: [],
    validate: arr => Array.isArray(arr),
  },
}, {
  timestamps: true, // adds createdAt / updatedAt
});

export default mongoose.model('User', userSchema);
=======
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
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

export interface IUser extends Document {
    email: string;
    password: string;
    confirmPassword?: string; // Optional, typically used for validation during signup
    role: string; // e.g., 'admin', 'user', etc.
    isCorrectPassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, default: 'user' }, // Default role is 'user'
    },
    { 
        timestamps: true,
        toObject: {
            transform: function (doc, ret) {
                delete ret.password; // Remove password from the returned object
                return ret;
            }
        }
    }
);

UserSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

// Hash the password before saving the user
UserSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
    }
    next();
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
>>>>>>> origin/main
