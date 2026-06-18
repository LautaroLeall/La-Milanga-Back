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
  cost: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    enum: ['Bebidas', 'Entradas / Minutas', 'Platos Principales', 'Pizzas', 'Sándwiches', 'Helados', 'Otro'],
    default: 'Otro',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
