import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to the Post model
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  replies: [
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
  isEdited: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},
 { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);

// Removed duplicate import of mongoose

export interface IComment extends Document {
  content: string;
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;