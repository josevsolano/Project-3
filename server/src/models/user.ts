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
