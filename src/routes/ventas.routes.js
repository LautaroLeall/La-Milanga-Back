const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/VentaController');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Cajeros y Admin pueden registrar ventas
router.post('/', verifyToken, checkRole(['Admin', 'Cajero']), ventaController.registrarVenta);

// Solo Admin puede ver todo el historial de ventas
router.get('/historial', verifyToken, checkRole(['Admin']), ventaController.getHistorial);

module.exports = router;
