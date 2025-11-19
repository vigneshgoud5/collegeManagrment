import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  passwordHash: string;
  role: 'academic' | 'student';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'academic' | 'student';
      };
    }
  }
}

