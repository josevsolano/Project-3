const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
      content: {
        type: String,
        required: true,
      },
      dateCreated: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},
 { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

import { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
}

const PostSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const PostModel = mongoose.model('Post', PostSchema) as mongoose.Model<IPost>;
export default PostModel;