const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Simple schema based on the plan
const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  salary: {
    type: Number,
  },
  enterprise: {
    type: Schema.Types.ObjectId,
    ref: 'Enterprise',
  },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
