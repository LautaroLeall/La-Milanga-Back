const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/VentaController');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Cajeros y Admin pueden registrar ventas
router.post('/', verifyToken, checkRole(['Admin', 'Cajero']), ventaController.registrarVenta);

// Admin, Cajero, y Stock pueden ver el historial de ventas
router.get('/historial', verifyToken, checkRole(['Admin', 'Cajero', 'Stock']), ventaController.getHistorial);
// Solo Admin puede ver las estadísticas avanzadas (ingresos, promedios, etc)
router.get('/stats', verifyToken, checkRole(['Admin']), ventaController.getStats);

module.exports = router;
