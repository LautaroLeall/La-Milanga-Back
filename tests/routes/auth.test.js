const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const bcrypt = require('bcryptjs');

describe('Auth Routes (/api/auth)', () => {
  const testUser = {
    username: 'testadmin',
    password: 'password123',
    role: 'Admin'
  };

  beforeEach(async () => {
    // Create a test user in the memory DB before each test
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    await User.create({
      username: testUser.username,
      password: hashedPassword,
      role: testUser.role,
      email: 'test@admin.com'
    });
  });

  describe('POST /api/auth/login', () => {
    it('debería retornar un token válido si las credenciales son correctas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.username).toEqual(testUser.username);
    });

    it('debería rechazar el inicio de sesión con contraseña incorrecta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });

    it('debería rechazar el inicio de sesión con usuario inexistente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'noexiste',
          password: testUser.password
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });

    it('debería retornar error 400 si faltan datos', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username
          // missing password
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/requeridos/i);
    });
  });
});
