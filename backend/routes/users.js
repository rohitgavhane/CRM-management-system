const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// Apply middleware to all user routes
router.use(verifyToken);

// @route   POST /api/users
// @desc    Create a new user
router.post(
  '/',
  checkPermission('users', 'create'),
  userController.createUser
);

// @route   GET /api/users
// @desc    Get all users
router.get(
  '/',
  checkPermission('users', 'read'),
  userController.getAllUsers
);

// @route   GET /api/users/:id
// @desc    Get a single user by ID
router.get(
  '/:id',
  checkPermission('users', 'read'),
  userController.getUserById
);

// @route   PUT /api/users/:id
// @desc    Update a user
router.put(
  '/:id',
  checkPermission('users', 'update'),
  userController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete a user
router.delete(
  '/:id',
  checkPermission('users', 'delete'),
  userController.deleteUser
);

module.exports = router;

