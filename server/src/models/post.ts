import mongoose from 'mongoose';

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

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  userId?: mongoose.Types.ObjectId;
  dateCreated: Date;
  tags: string[];
  likes: number;
  comments: {
    userId: mongoose.Types.ObjectId;
    content: string;
    dateCreated: Date;
  }[];
  createdAt: Date;
}

const Post = mongoose.model('Post', postSchema);
export default Post;