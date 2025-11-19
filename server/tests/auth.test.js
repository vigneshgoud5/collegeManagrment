const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../dist/app');
const { User } = require('../dist/models/User');
const { StudentProfile } = require('../dist/models/StudentProfile');
const bcrypt = require('bcrypt');

describe('Auth & student self', () => {
  it('logs in student with role and accesses self endpoints', async () => {
    const passwordHash = await bcrypt.hash('Passw0rd!', 10);
    const user = await User.create({ email: 's1@example.com', passwordHash, role: 'student', status: 'active' });
    await StudentProfile.create({ user: user._id, firstName: 'Stu', lastName: 'Dent' });

    const agent = request.agent(app);

    const loginRes = await agent
      .post('/api/auth/login')
      .send({ email: 's1@example.com', password: 'Passw0rd!', role: 'student' })
      .expect(200);
    expect(loginRes.body.user).toBeDefined();
    expect(loginRes.body.user.role).toBe('student');

    const meRes = await agent.get('/api/students/me').expect(200);
    expect(meRes.body.profile.firstName).toBe('Stu');
  });
});


