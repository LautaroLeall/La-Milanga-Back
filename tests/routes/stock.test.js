const request = require('supertest');
const app = require('../../src/app');
const Product = require('../../src/models/Product');
const User = require('../../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Stock Routes (/api/stock)', () => {
  let token;
  let productId;

  beforeEach(async () => {
    // 1. Create a user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const user = await User.create({
      username: 'stockadmin',
      password: hashedPassword,
      role: 'Admin',
      email: 'stock@admin.com'
    });

    // 2. Generate token
    token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    // ensure JWT_SECRET matches
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'secret';

    // 3. Create a default product
    const product = await Product.create({
      id: 'prod_test_1',
      name: 'Test Product',
      category: 'Bebidas',
      price: 1000,
      cost: 500,
      stock: 10
    });
    productId = product._id;
  });

  describe('GET /api/stock/inventory', () => {
    it('debería rechazar si no hay token', async () => {
      const res = await request(app).get('/api/stock/inventory');
      expect(res.statusCode).toEqual(401);
    });

    it('debería retornar los productos si el token es válido', async () => {
      const res = await request(app)
        .get('/api/stock/inventory')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Test Product');
    });
  });

  describe('POST /api/stock', () => {
    it('debería crear un producto nuevo si es Admin', async () => {
      const res = await request(app)
        .post('/api/stock')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: 'prod_test_2',
          name: 'New Product',
          category: 'Entradas / Minutas',
          price: 2000,
          cost: 1000,
          stock: 50
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toBe('New Product');

      // Verify in DB
      const inDb = await Product.findOne({ name: 'New Product' });
      expect(inDb).toBeTruthy();
    });
  });

  describe('PUT /api/stock/:id', () => {
    it('debería actualizar el producto exitosamente', async () => {
      const res = await request(app)
        .put(`/api/stock/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 1500,
          stock: 15
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.price).toBe(1500);
      expect(res.body.stock).toBe(15);
    });
  });

  describe('DELETE /api/stock/:id', () => {
    it('debería eliminar el producto', async () => {
      const res = await request(app)
        .delete(`/api/stock/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);

      const inDb = await Product.findById(productId);
      expect(inDb).toBeNull();
    });
  });
});
