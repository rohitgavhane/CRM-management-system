const Employee = require('../models/employee');

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private
exports.createEmployee = async (req, res) => {
  const { name, department, salary, enterprise } = req.body;
  try {
    let employee = new Employee({ name, department, salary, enterprise });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('enterprise', 'name');
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/employees/:id
// @desc    Get a single employee
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('enterprise', 'name');
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT /api/employees/:id
// @desc    Update an employee
// @access  Private
exports.updateEmployee = async (req, res) => {
  const { name, department, salary, enterprise } = req.body;
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    if (name) employee.name = name;
    if (department) employee.department = department;
    if (salary) employee.salary = salary;
    if (enterprise) employee.enterprise = enterprise;
    
    await employee.save();
    
    // Return populated employee
    const updatedEmployee = await Employee.findById(req.params.id).populate('enterprise', 'name');
    res.json(updatedEmployee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private
exports.deleteEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    await employee.deleteOne();
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
