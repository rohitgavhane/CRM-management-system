const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Find the default "User" role
    let userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {
      // This should not happen if seed script is run
      return res.status(400).json({ msg: 'Default "User" role not found. Please run seed script.' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: userRole._id, // Assign default "User" role
    });

    // Password will be hashed by pre-save hook in User model
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists AND populate their role information
    // .populate('role') is essential here!
    let user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (password incorrect)' });
    }

    // Check if role was populated
    if (!user.role) {
       return res.status(500).json({ msg: 'User role not found or not populated. Check database.' });
    }

    // --- THIS IS THE CRITICAL SECTION ---
    // Create JWT Payload
    // We MUST include the permissions from the populated role.
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role.name,
        permissions: user.role.permissions, // This line adds permissions to the token
      },
    };
    // ------------------------------------

    // Sign and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

