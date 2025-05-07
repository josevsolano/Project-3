import { config } from 'dotenv';
config(); // loads .env into process.env

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/techmatchup';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const db = mongoose.connection;
export default db;
