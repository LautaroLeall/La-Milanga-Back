const mongoose = require('mongoose');

const ventaItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String, // Guardamos el nombre y precio al momento de la venta para histórico
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const ventaSchema = new mongoose.Schema({
  cajeroId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [ventaItemSchema],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Venta', ventaSchema);
