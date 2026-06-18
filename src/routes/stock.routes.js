const express = require('express');
const router = express.Router();
const stockController = require('../controllers/StockController');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Rutas compartidas (Todos pueden ver el menú disponible)
router.get('/menu', verifyToken, stockController.getMenu);

// Rutas protegidas (Solo Admin y Stock pueden gestionar el inventario total)
router.get('/inventory', verifyToken, checkRole(['Admin', 'Stock']), stockController.getInventory);
router.post('/', verifyToken, checkRole(['Admin', 'Stock']), stockController.createProduct);
router.patch('/:id/add', verifyToken, checkRole(['Admin', 'Stock']), stockController.addStock);

module.exports = router;
