const stockService = require('../services/StockService');

class StockController {
  async getMenu(req, res) {
    try {
      const products = await stockService.getAvailableProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getInventory(req, res) {
    try {
      const products = await stockService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await stockService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addStock(req, res) {
    try {
      const { quantity } = req.body;
      if (!quantity || isNaN(quantity)) {
        return res.status(400).json({ message: 'Cantidad inválida' });
      }
      const updatedProduct = await stockService.updateStock(req.params.id, Number(quantity));
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Edita un producto completo (nombre, precio, stock, categoría)
  async updateProduct(req, res) {
    try {
      const updated = await stockService.updateProduct(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Elimina un producto del catálogo
  async deleteProduct(req, res) {
    try {
      await stockService.deleteProduct(req.params.id);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new StockController();
