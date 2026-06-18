const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Cajero', 'Stock'],
    default: 'Cajero',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
