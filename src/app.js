const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'La Milanga API is running (Boilerplate)' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stock', require('./routes/stock.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB local'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
