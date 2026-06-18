const Product = require('../models/Product');

class StockService {
  async getAllProducts() {
    return await Product.find().sort({ category: 1, name: 1 });
  }

  async getAvailableProducts() {
    return await Product.find({ stock: { $gt: 0 } }).sort({ category: 1, name: 1 });
  }

  async createProduct(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  async updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    // Add quantity to current stock (quantity can be negative for sales, but that's VentaService job)
    // For Stock role, this is usually replacing or adding stock.
    product.stock += quantity;
    
    if (product.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    return await product.save();
  }
}

module.exports = new StockService();
