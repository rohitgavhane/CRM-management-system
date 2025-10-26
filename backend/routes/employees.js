const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, checkPermission } = require('../middleware/auth');


router.use(verifyToken);

router.post(
  '/',
  checkPermission('employees', 'create'),
  employeeController.createEmployee
);
router.get(
  '/',
  checkPermission('employees', 'read'),
  employeeController.getAllEmployees
);
router.get(
  '/:id',
  checkPermission('employees', 'read'),
  employeeController.getEmployeeById
);
router.put(
  '/:id',
  checkPermission('employees', 'update'),
  employeeController.updateEmployee
);
router.delete(
  '/:id',
  checkPermission('employees', 'delete'),
  employeeController.deleteEmployee
);

module.exports = router;

