import type { Request, Response } from 'express';
import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export async function getMe(req: Request, res: Response) {
  const userId = req.user!.id;
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  return res.json({ profile });
}

export async function updateMe(req: Request, res: Response) {
  // Verify user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  const userId = req.user.id;
  const { contact } = req.body ?? {};

  // Students can only update their contact information
  if (!contact || typeof contact !== 'object') {
    return res.status(400).json({ message: 'Contact information is required' });
  }

  // Verify user exists and is active
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify user is active
  if (user.status !== 'active') {
    return res.status(403).json({ message: 'Forbidden: Account is inactive' });
  }

  // Verify user can only update their own profile
  if (user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden: Cannot update another user\'s profile' });
  }

  const profile = await StudentProfile.findOneAndUpdate(
    { user: userId },
    { $set: { contact } },
    { new: true, runValidators: true }
  );
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  return res.json({ profile });
}

export async function changePassword(req: Request, res: Response) {
  // Verify user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });

  // Fetch and verify user exists and is active
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify user is active
  if (user.status !== 'active') {
    return res.status(403).json({ message: 'Forbidden: Account is inactive' });
  }

  // Verify user can only change their own password
  if (user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden: Cannot change another user\'s password' });
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid current password' });

  const saltRounds = 10;
  user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
  await user.save();
  return res.status(204).send();
}


