const Enterprise = require('../models/Enterprise');

// @route   POST /api/enterprises
// @desc    Create a new enterprise
// @access  Private
exports.createEnterprise = async (req, res) => {
  const { name, location, contactInfo } = req.body;
  try {
    let enterprise = new Enterprise({ name, location, contactInfo });
    await enterprise.save();
    res.status(201).json(enterprise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/enterprises
// @desc    Get all enterprises
// @access  Private
exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprises = await Enterprise.find();
    res.json(enterprises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/enterprises/:id
// @desc    Get a single enterprise
// @access  Private
exports.getEnterpriseById = async (req, res) => {
  try {
    const enterprise = await Enterprise.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ msg: 'Enterprise not found' });
    }
    res.json(enterprise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT /api/enterprises/:id
// @desc    Update an enterprise
// @access  Private
exports.updateEnterprise = async (req, res) => {
  const { name, location, contactInfo } = req.body;
  try {
    let enterprise = await Enterprise.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ msg: 'Enterprise not found' });
    }
    if (name) enterprise.name = name;
    if (location) enterprise.location = location;
    if (contactInfo) enterprise.contactInfo = contactInfo;
    
    await enterprise.save();
    res.json(enterprise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE /api/enterprises/:id
// @desc    Delete an enterprise
// @access  Private
exports.deleteEnterprise = async (req, res) => {
  try {
    let enterprise = await Enterprise.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ msg: 'Enterprise not found' });
    }
    
    // Optional: Add check here to see if employees or users are linked
    // before allowing deletion. For this simple CRUD, we'll allow it.

    await enterprise.deleteOne();
    res.json({ msg: 'Enterprise removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
