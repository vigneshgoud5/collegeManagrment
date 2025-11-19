import request from 'supertest';
import app from '../src/index.js';
import { connectDB } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { StudentProfile } from '../src/models/StudentProfile.js';
import { hashPassword } from '../src/services/authService.js';

async function loginAs(email: string, password: string, role: 'academic' | 'student') {
  const agent = request.agent(app);
  await agent.post('/api/auth/login').send({ email, password, role });
  return agent;
}

describe('Students flows', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });
  afterAll(async () => {
    await (await import('mongoose')).default.connection.close();
  });
  beforeEach(async () => {
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
  });

  it('student can get and update own profile', async () => {
    const passwordHash = await hashPassword('pw');
    const student = await User.create({ email: 's1@example.com', passwordHash, role: 'student' });
    await StudentProfile.create({ user: student._id, firstName: 'Stu', lastName: 'Dent' });

    const agent = await loginAs('s1@example.com', 'pw', 'student');
    const res1 = await agent.get('/api/students/me').expect(200);
    expect(res1.body.profile.firstName).toBe('Stu');

    const res2 = await agent
      .put('/api/students/me')
      .send({ firstName: 'New', lastName: 'Name' })
      .expect(200);
    expect(res2.body.profile.firstName).toBe('New');
  });

  it('academic can create and list students', async () => {
    const pw = await hashPassword('pw');
    await User.create({ email: 'a1@example.com', passwordHash: pw, role: 'academic' });
    const agent = await loginAs('a1@example.com', 'pw', 'academic');

    await agent
      .post('/api/students')
      .send({ email: 's2@example.com', password: 'temp123', firstName: 'Stu2', lastName: 'Dent2' })
      .expect(201);

    const res = await agent.get('/api/students').expect(200);
    expect((res.body.students || []).length).toBeGreaterThan(0);
  });
});


