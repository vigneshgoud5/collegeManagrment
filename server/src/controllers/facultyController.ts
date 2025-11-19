import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { hashPassword } from '../services/authService.js';

export async function listFaculty(req: Request, res: Response) {
  const { department, q } = req.query as { department?: string; q?: string };
  
  const filter: Record<string, unknown> = { role: 'academic' };
  
  if (department) filter.department = department;
  if (q) {
    filter.$or = [
      { email: { $regex: q, $options: 'i' } },
      { name: { $regex: q, $options: 'i' } },
    ];
  }

  const faculty = await User.find(filter).select('-passwordHash');
  return res.json({ faculty });
}

export async function getFaculty(req: Request, res: Response) {
  const { id } = req.params;
  const faculty = await User.findById(id).select('-passwordHash');
  if (!faculty || faculty.role !== 'academic') {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.json({ faculty });
}

export async function createFaculty(req: Request, res: Response) {
  const { email, password, subRole, name, department, avatarUrl } = req.body ?? {};
  
  if (!email || !password || !subRole || !name) {
    return res.status(400).json({ message: 'Missing required fields: email, password, subRole, and name are required' });
  }

  if (subRole !== 'faculty' && subRole !== 'administrative') {
    return res.status(400).json({ message: 'subRole must be either "faculty" or "administrative"' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const faculty = await User.create({
      email,
      passwordHash,
      role: 'academic',
      subRole,
      name,
      department,
      avatarUrl,
      status: 'active',
    });

    return res.status(201).json({
      faculty: {
        id: faculty.id,
        email: faculty.email,
        role: faculty.role,
        subRole: faculty.subRole,
        name: faculty.name,
        department: faculty.department,
        avatarUrl: faculty.avatarUrl,
        status: faculty.status,
      },
    });
  } catch (error: any) {
    console.error('Create faculty error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateFaculty(req: Request, res: Response) {
  // Verify user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  // Verify admin user is active
  const adminUser = await User.findById(req.user.id);
  if (!adminUser || adminUser.status !== 'active') {
    return res.status(403).json({ message: 'Forbidden: Account is inactive' });
  }

  const { id } = req.params;
  const { email, name, subRole, department, avatarUrl } = req.body ?? {};

  const faculty = await User.findById(id);
  if (!faculty || faculty.role !== 'academic') {
    return res.status(404).json({ message: 'Not found' });
  }

  // Prevent administrators from changing their own subRole
  if (req.user.id === id && subRole && subRole !== faculty.subRole) {
    return res.status(403).json({ message: 'Cannot change your own subRole' });
  }

  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    faculty.email = email.toLowerCase().trim();
  }

  if (subRole && (subRole === 'faculty' || subRole === 'administrative')) {
    faculty.subRole = subRole;
  }

  if (name !== undefined) {
    faculty.name = name;
  }

  if (department !== undefined) {
    faculty.department = department || undefined;
  }

  if (avatarUrl !== undefined) {
    faculty.avatarUrl = avatarUrl || undefined;
  }

  await faculty.save();

  return res.json({
    faculty: {
      id: faculty.id,
      email: faculty.email,
      role: faculty.role,
      subRole: faculty.subRole,
      name: faculty.name,
      department: faculty.department,
      avatarUrl: faculty.avatarUrl,
      status: faculty.status,
    },
  });
}

export async function toggleFacultyStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status: 'active' | 'inactive' };
  
  if (!status) {
    return res.status(400).json({ message: 'Missing status' });
  }

  // Prevent administrators from deactivating themselves
  if (req.user?.id === id) {
    return res.status(403).json({ message: 'Cannot change your own status' });
  }

  const faculty = await User.findById(id);
  if (!faculty || faculty.role !== 'academic') {
    return res.status(404).json({ message: 'Not found' });
  }

  faculty.status = status;
  await faculty.save();

  return res.status(204).send();
}

export async function deleteFaculty(req: Request, res: Response) {
  const { id } = req.params;
  
  // Prevent administrators from deleting themselves
  if (req.user?.id === id) {
    return res.status(403).json({ message: 'Cannot delete your own account' });
  }

  const faculty = await User.findById(id);
  if (!faculty || faculty.role !== 'academic') {
    return res.status(404).json({ message: 'Not found' });
  }

  // Delete the faculty user
  await User.findByIdAndDelete(id);

  return res.status(204).send();
}

