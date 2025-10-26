const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, checkPermission } = require('../middleware/auth');


router.use(verifyToken);


router.post(
  '/',
  checkPermission('roles', 'create'),
  roleController.createRole
);

router.get(
  '/',
  checkPermission('roles', 'read'),
  roleController.getAllRoles
);

router.get(
  '/:id',
  checkPermission('roles', 'read'),
  roleController.getRoleById
);

router.put(
  '/:id',
  checkPermission('roles', 'update'),
  roleController.updateRole
);


router.delete(
  '/:id',
  checkPermission('roles', 'delete'),
  roleController.deleteRole
);

module.exports = router;

