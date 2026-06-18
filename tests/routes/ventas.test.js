const request = require('supertest');
const app = require('../../src/app');
const Product = require('../../src/models/Product');
const User = require('../../src/models/User');
const Venta = require('../../src/models/Venta');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Ventas Routes (/api/ventas)', () => {
  let token;
  let testProduct;
  let cashierUser;

  beforeEach(async () => {
    // 1. Create a cashier user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('cashierpass', salt);
    cashierUser = await User.create({
      username: 'cashier',
      password: hashedPassword,
      role: 'Cajero',
      email: 'cajero@test.com'
    });

    // 2. Generate token
    token = jwt.sign(
      { id: cashierUser._id, username: cashierUser.username, role: cashierUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'secret';

    // 3. Create a product with stock = 10
    testProduct = await Product.create({
      id: 'empanada_carne',
      name: 'Empanada de Carne',
      category: 'Entradas / Minutas',
      price: 500,
      cost: 200,
      stock: 10
    });
  });

  describe('POST /api/ventas', () => {
    it('debería rechazar compra con carrito vacío', async () => {
      const res = await request(app)
        .post('/api/ventas')
        .set('Authorization', `Bearer ${token}`)
        .send({ items: [] });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/vacío/i);
    });

    it('debería procesar compra válida y reducir el stock del producto', async () => {
      const cantidadAComprar = 3;
      const res = await request(app)
        .post('/api/ventas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [
            { productId: testProduct._id, quantity: cantidadAComprar }
          ]
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.venta.total).toBe(testProduct.price * cantidadAComprar);

      // Verificamos que el stock se haya reducido
      const productoActualizado = await Product.findById(testProduct._id);
      expect(productoActualizado.stock).toBe(10 - cantidadAComprar);

      // Verificamos que se haya guardado en DB
      const ventaEnDb = await Venta.findById(res.body.venta._id);
      expect(ventaEnDb).toBeTruthy();
      expect(ventaEnDb.totalCosto).toBe(testProduct.cost * cantidadAComprar);
    });

    it('debería rechazar la compra si no hay stock suficiente', async () => {
      const res = await request(app)
        .post('/api/ventas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [
            { productId: testProduct._id, quantity: 15 } // Sólo hay 10
          ]
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/insuficiente/i);

      // Verificamos que el stock NO se haya modificado
      const productoActualizado = await Product.findById(testProduct._id);
      expect(productoActualizado.stock).toBe(10);
    });
  });
});
