const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Simple schema based on the plan
const EnterpriseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  contactInfo: {
    type: String,
  },
});

module.exports = mongoose.model('Enterprise', EnterpriseSchema);
