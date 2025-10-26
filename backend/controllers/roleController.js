const Role = require('../models/Role');


exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    let role = await Role.findOne({ name });
    if (role) {
      return res.status(400).json({ msg: 'Role already exists' });
    }

    role = new Role({
      name,
      permissions,
    });

    await role.save();
    res.status(201).json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ msg: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    let role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ msg: 'Role not found' });
    }

    if (name) role.name = name;
    if (permissions) role.permissions = permissions;

    await role.save();
    res.json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.deleteRole = async (req, res) => {
  try {
    let role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ msg: 'Role not found' });
    }
    
    // Add check: Don't delete "Admin" or "User" default roles
    if (role.name === 'Admin' || role.name === 'User') {
      return res.status(400).json({ msg: 'Cannot delete default roles' });
    }

    // Add check: Make sure no users are assigned this role before deleting
    const User = require('../models/User');
    const userCount = await User.countDocuments({ role: req.params.id });
    if (userCount > 0) {
      return res.status(400).json({ msg: 'Cannot delete role. Users are still assigned this role.' });
    }

    await role.deleteOne();
    res.json({ msg: 'Role removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
