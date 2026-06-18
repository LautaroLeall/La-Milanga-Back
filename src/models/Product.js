const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    enum: ['Comida', 'Bebida', 'Postre', 'Otro'],
    default: 'Comida',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
