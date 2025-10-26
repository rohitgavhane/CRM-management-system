const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// Apply middleware to all product routes
router.use(verifyToken);

router.post(
  '/',
  checkPermission('products', 'create'),
  productController.createProduct
);
router.get(
  '/',
  checkPermission('products', 'read'),
  productController.getAllProducts
);
router.get(
  '/:id',
  checkPermission('products', 'read'),
  productController.getProductById
);
router.put(
  '/:id',
  checkPermission('products', 'update'),
  productController.updateProduct
);
router.delete(
  '/:id',
  checkPermission('products', 'delete'),
  productController.deleteProduct
);

module.exports = router;

