const User = require('../models/User');
const Role = require('../models/Role');

// @route   POST /api/users
// @desc    Create a new user (Admin-only)
// @access  Private (Admin)
exports.createUser = async (req, res) => {
  const { username, email, password, roleId, enterpriseId } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const userRole = await Role.findById(roleId);
    if (!userRole) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    user = new User({
      username,
      email,
      password,
      role: roleId,
      enterprise: enterpriseId || null,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Populate role and enterprise information
    const users = await User.find()
      .populate('role', 'name')
      .populate('enterprise', 'name')
      .select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/users/:id
// @desc    Get a single user by ID
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('role', 'name')
      .populate('enterprise', 'name')
      .select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT /api/users/:id
// @desc    Update a user (e.g., assign role/enterprise)
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  const { username, email, roleId, enterpriseId } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (roleId) {
      const userRole = await Role.findById(roleId);
      if (!userRole) {
        return res.status(400).json({ msg: 'Invalid role' });
      }
      user.role = roleId;
    }
    if (enterpriseId) user.enterprise = enterpriseId;

    await user.save();
    // Return updated user without password
    const updatedUser = await User.findById(req.params.id)
      .populate('role', 'name')
      .populate('enterprise', 'name')
      .select('-password');
      
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.deleteOne();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
