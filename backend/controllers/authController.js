const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }


    let userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {

      return res.status(400).json({ msg: 'Default "User" role not found. Please run seed script.' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: userRole._id, 
    });


    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
  
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


    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role.name,
        permissions: user.role.permissions, 
      },
    };


    // Sign and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, 
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

