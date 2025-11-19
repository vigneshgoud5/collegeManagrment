#!/usr/bin/env node
/**
 * Script to create a student directly in the database
 * Run: node scripts/create-student.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['academic', 'student'], required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const StudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dob: Date,
  contact: {
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
  },
  department: { type: String, trim: true },
  year: { type: Number, min: 1, max: 5 },
  avatarUrl: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const StudentProfile = mongoose.model('StudentProfile', StudentProfileSchema);

async function createStudent() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college_portal';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'sunny@gmail.com' });
    if (existingUser) {
      console.log('❌ User with email sunny@gmail.com already exists');
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash('qwertyuiop', 10);

    // Create user
    const user = await User.create({
      email: 'sunny@gmail.com',
      passwordHash,
      role: 'student',
      status: 'active',
    });
    console.log('✅ User created:', user.email);

    // Convert dob from DD-MM-YYYY to Date
    const dobParts = '18-03-2005'.split('-');
    const dob = new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`);

    // Create student profile
    const profile = await StudentProfile.create({
      user: user._id,
      firstName: 'Sunny',
      lastName: 'Reddy',
      dob: dob,
      contact: {
        phone: '9948891448',
      },
      department: 'CSE',
      year: 3,
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hUz-P7Cz2ZKn2DEN_EvFhjwmRiURX7r9TA&s',
    });
    console.log('✅ Student profile created:', profile.firstName, profile.lastName);

    console.log('\n✅ Student created successfully!');
    console.log('   Email:', user.email);
    console.log('   Name:', profile.firstName, profile.lastName);
    console.log('   Department:', profile.department);
    console.log('   Year:', profile.year);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating student:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createStudent();

