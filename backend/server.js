const express = require('express');
const app = express();
require('dotenv').config()
const connectDB = require('./config/db')
const cors = require('cors');




connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => res.send('API Running'));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/enterprises', require('./routes/enterprises'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/products', require('./routes/products'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;