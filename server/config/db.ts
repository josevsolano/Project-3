import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;