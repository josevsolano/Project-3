import { config } from 'dotenv';
config();

import mongoose from 'mongoose';
import db from '../config/connection.js';
import { User } from '../models/index.js'; // adjust path as needed

const users = [
  {
    email: 'alex.tutor@example.com',
    password: 'password123',
    skills: ['Math', 'Physics'],
    needs: [],
  },
  {
    email: 'jordan.tutor@example.com',
    password: 'password123',
    skills: ['English', 'Writing'],
    needs: [],
  },
  {
    email: 'taylor.student@example.com',
    password: 'password123',
    skills: [],
    needs: ['Math'],
  },
  {
    email: 'riley.student@example.com',
    password: 'password123',
    skills: [],
    needs: ['Computer Science', 'History'],
  },
];

async function seed() {
  try {
    await db.dropDatabase();
    console.log('🗑 Dropped database');

    const created = await User.insertMany(users);
    console.log(`🌱 Seeded ${created.length} users`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
