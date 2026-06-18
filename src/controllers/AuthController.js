const authService = require('../services/AuthService');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
      }

      const authData = await authService.login(username, password);
      res.json(authData);

    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  // Endpoint temporal para crear el primer Admin y usuarios de prueba
  async setupUsuarios(req, res) {
    try {
      const { username, password, role } = req.body;
      const newUser = await authService.registerInitialUser(username, password, role);
      res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
