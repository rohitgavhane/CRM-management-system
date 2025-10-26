const Product = require('../models/product');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
exports.createProduct = async (req, res) => {
  const { name, price, status } = req.body;
  try {
    let product = new Product({ name, price, status });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/products
// @desc    Get all products
// @access  Private
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/products/:id
// @desc    Get a single product
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
exports.updateProduct = async (req, res) => {
  const { name, price, status } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(4404).json({ msg: 'Product not found' });
    }
    if (name) product.name = name;
    if (price) product.price = price;
    if (status) product.status = status;
    
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
