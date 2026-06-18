const Venta = require('../models/Venta');
const Product = require('../models/Product');

class VentaService {
  async procesarVenta(cajeroId, items) {
    if (!items || items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    let totalVenta = 0;
    let totalCosto = 0;
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
      totalCosto += (product.cost || 0) * item.quantity;
      
      ventaItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        cost: product.cost || 0,
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
      total: totalVenta,
      totalCosto: totalCosto
    });

    return await nuevaVenta.save();
  }

  async obtenerHistorialVentas() {
    return await Venta.find().populate('cajeroId', 'username role').sort({ createdAt: -1 });
  }

  async getEstadisticas() {
    // 1. Ingresos, Costos y cantidad total de ventas
    const totalStats = await Venta.aggregate([
      {
        $group: {
          _id: null,
          totalIngresos: { $sum: '$total' },
          totalCostos: { $sum: '$totalCosto' },
          cantidadVentas: { $sum: 1 }
        }
      }
    ]);

    // 2. Productos más vendidos
    const topProducts = await Venta.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          cantidadVendida: { $sum: '$items.quantity' },
          ingresosGenerados: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: 10 }
    ]);

    const resumen = totalStats.length > 0 ? totalStats[0] : { totalIngresos: 0, totalCostos: 0, cantidadVentas: 0 };
    const totalGanancia = (resumen.totalIngresos || 0) - (resumen.totalCostos || 0);

    return {
      resumen: {
        ...resumen,
        totalGanancia
      },
      topProducts
    };
  }
}

module.exports = new VentaService();
