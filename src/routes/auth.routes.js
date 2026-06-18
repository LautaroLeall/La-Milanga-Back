const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Rutas públicas
router.post('/login', authController.login);

// Ruta para setup inicial (solo para pruebas locales, idealmente se borra o se protege con llave maestra en prod)
router.post('/setup', authController.setupUsuarios);

// Ejemplo de ruta protegida (solo Admin) - Se puede mover a otro router después
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'Estás autenticado', user: req.user });
});

module.exports = router;
