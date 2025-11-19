import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(env.MONGO_URI, options);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      console.log(`   Database: ${mongoose.connection.db?.databaseName}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    console.log('MongoDB connection established');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('\n💡 Make sure MongoDB is running:');
    console.error('   - Using Docker: sudo docker compose up -d mongo');
    console.error('   - Or install MongoDB locally and start the service');
    throw error;
  }
};

