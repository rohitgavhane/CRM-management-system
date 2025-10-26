const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Simple schema based on the plan
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Discontinued'],
    default: 'In Stock',
  },
});

module.exports = mongoose.model('Product', ProductSchema);
