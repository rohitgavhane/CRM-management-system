const express = require('express');
const router = express.Router();
const enterpriseController = require('../controllers/enterpriseController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// Apply middleware to all enterprise routes
router.use(verifyToken);

router.post(
  '/',
  checkPermission('enterprises', 'create'),
  enterpriseController.createEnterprise
);
router.get(
  '/',
  checkPermission('enterprises', 'read'),
  enterpriseController.getAllEnterprises
);
router.get(
  '/:id',
  checkPermission('enterprises', 'read'),
  enterpriseController.getEnterpriseById
);
router.put(
  '/:id',
  checkPermission('enterprises', 'update'),
  enterpriseController.updateEnterprise
);
router.delete(
  '/:id',
  checkPermission('enterprises', 'delete'),
  enterpriseController.deleteEnterprise
);

module.exports = router;

