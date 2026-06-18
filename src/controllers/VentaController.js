const ventaService = require('../services/VentaService');

class VentaController {
  async registrarVenta(req, res) {
    try {
      const { items } = req.body;
      const cajeroId = req.user.id; // Obtenido del token JWT

      const venta = await ventaService.procesarVenta(cajeroId, items);
      res.status(201).json({ message: 'Venta registrada con éxito', venta });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getHistorial(req, res) {
    try {
      const historial = await ventaService.obtenerHistorialVentas();
      res.json(historial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await ventaService.getEstadisticas();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new VentaController();
