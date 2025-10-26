const Enterprise = require('../models/Enterprise');


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


exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprises = await Enterprise.find();
    res.json(enterprises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


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


exports.deleteEnterprise = async (req, res) => {
  try {
    let enterprise = await Enterprise.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ msg: 'Enterprise not found' });
    }
    


    await enterprise.deleteOne();
    res.json({ msg: 'Enterprise removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
