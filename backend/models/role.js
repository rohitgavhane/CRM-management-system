const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = {
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
};

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    users: permissionSchema,
    roles: permissionSchema,
    enterprises: permissionSchema,
    employees: permissionSchema,
    products: permissionSchema,
  },
});

module.exports = mongoose.model('Role', RoleSchema);
