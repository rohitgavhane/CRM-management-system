const Product = require('../models/Product');

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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


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
