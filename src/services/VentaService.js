const Venta = require('../models/Venta');
const Product = require('../models/Product');

class VentaService {
  async procesarVenta(cajeroId, items) {
    if (!items || items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    let totalVenta = 0;
    const ventaItems = [];

    // 1. Verificación de stock y cálculo de totales
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto: ${product.name}`);
      }

      totalVenta += product.price * item.quantity;
      
      ventaItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    // 2. Descuento de stock ("Simulamos" atomicidad secuencialmente)
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // 3. Persistencia de la Venta
    const nuevaVenta = new Venta({
      cajeroId,
      items: ventaItems,
      total: totalVenta
    });

    return await nuevaVenta.save();
  }

  async obtenerHistorialVentas() {
    return await Venta.find().populate('cajeroId', 'username role').sort({ createdAt: -1 });
  }
}

module.exports = new VentaService();
