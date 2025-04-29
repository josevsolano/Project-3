const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    default: 'default.jpg', // Default profile picture
  },
  bio: {
    type: String,
    default: 'Hello! I am a new user.',
    },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Reference to the Post model
    },
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

// Example User model definition and export
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema) as mongoose.Model<IUser>;
export default User;