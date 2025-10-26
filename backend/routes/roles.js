const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// Apply middleware to all role routes
router.use(verifyToken);

// @route   POST /api/roles
// @desc    Create a new role
router.post(
  '/',
  checkPermission('roles', 'create'),
  roleController.createRole
);

// @route   GET /api/roles
// @desc    Get all roles
router.get(
  '/',
  checkPermission('roles', 'read'),
  roleController.getAllRoles
);

// @route   GET /api/roles/:id
// @desc    Get a single role by ID
router.get(
  '/:id',
  checkPermission('roles', 'read'),
  roleController.getRoleById
);

// @route   PUT /api/roles/:id
// @desc    Update a role
router.put(
  '/:id',
  checkPermission('roles', 'update'),
  roleController.updateRole
);

// @route   DELETE /api/roles/:id
// @desc    Delete a role
router.delete(
  '/:id',
  checkPermission('roles', 'delete'),
  roleController.deleteRole
);

module.exports = router;

