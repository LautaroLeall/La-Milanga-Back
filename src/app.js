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

module.exports = app;
