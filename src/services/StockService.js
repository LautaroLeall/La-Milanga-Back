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
    if (!product) throw new Error('Producto no encontrado');
    product.stock += quantity;
    if (product.stock < 0) throw new Error('El stock no puede ser negativo');
    return await product.save();
  }

  // Edita nombre, precio, stock y/o categoría de un producto
  async updateProduct(productId, data) {
    const product = await Product.findByIdAndUpdate(productId, data, { new: true, runValidators: true });
    if (!product) throw new Error('Producto no encontrado');
    return product;
  }

  // Elimina un producto del catálogo
  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) throw new Error('Producto no encontrado');
    return product;
  }
}

module.exports = new StockService();
