const stockService = require('../services/StockService');

class StockController {
  async getMenu(req, res) {
    try {
      // Para el cajero, solo mostramos productos con stock > 0
      const products = await stockService.getAvailableProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getInventory(req, res) {
    try {
      // Para el Admin/Stock, mostramos todos los productos incluso sin stock
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
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (!quantity || isNaN(quantity)) {
        return res.status(400).json({ message: 'Cantidad inválida' });
      }

      const updatedProduct = await stockService.updateStock(id, Number(quantity));
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new StockController();
