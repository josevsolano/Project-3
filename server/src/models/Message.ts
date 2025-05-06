// server/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  sentAt: {
    type: Date,
    default: () => new Date(),
  },
}, {
  timestamps: false,
});

export default mongoose.model('Message', messageSchema);
