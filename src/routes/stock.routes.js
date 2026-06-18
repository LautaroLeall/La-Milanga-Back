const express = require('express');
const router = express.Router();
const stockController = require('../controllers/StockController');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Todos los roles autenticados pueden ver el menú disponible (stock > 0)
router.get('/menu', verifyToken, stockController.getMenu);

// Admin y Stock gestionan el inventario completo
router.get('/inventory', verifyToken, checkRole(['Admin', 'Stock']), stockController.getInventory);
router.post('/', verifyToken, checkRole(['Admin', 'Stock']), stockController.createProduct);
router.put('/:id', verifyToken, checkRole(['Admin', 'Stock']), stockController.updateProduct);
router.delete('/:id', verifyToken, checkRole(['Admin', 'Stock']), stockController.deleteProduct);

module.exports = router;
