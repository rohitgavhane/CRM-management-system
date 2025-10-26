const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// Apply middleware to all user routes
router.use(verifyToken);

router.post(
  '/',
  checkPermission('users', 'create'),
  userController.createUser
);


router.get(
  '/',
  checkPermission('users', 'read'),
  userController.getAllUsers
);


router.get(
  '/:id',
  checkPermission('users', 'read'),
  userController.getUserById
);


router.put(
  '/:id',
  checkPermission('users', 'update'),
  userController.updateUser
);


router.delete(
  '/:id',
  checkPermission('users', 'delete'),
  userController.deleteUser
);

module.exports = router;

