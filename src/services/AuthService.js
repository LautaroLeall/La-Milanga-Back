const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  async login(username, password) {
    // 1. Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    // 3. Generar JWT
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return {
      token,
      user: payload
    };
  }

  // Método auxiliar para el setup inicial (no se expone en UI pública)
  async registerInitialUser(username, password, role) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    return { id: newUser._id, username: newUser.username, role: newUser.role };
  }
}

module.exports = new AuthService();
