require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
const connectDB = require('./config/db');


connectDB();

const seedData = async () => {
  try {
   
    await Role.deleteMany({});
    await User.deleteMany({});

    console.log('Data Cleared...');


    const allPermissions = {
      users: { create: true, read: true, update: true, delete: true },
      roles: { create: true, read: true, update: true, delete: true },
      enterprises: { create: true, read: true, update: true, delete: true },
      employees: { create: true, read: true, update: true, delete: true },
      products: { create: true, read: true, update: true, delete: true },
    };
    const adminRole = await Role.create({
      name: 'Admin',
      permissions: allPermissions,
    });

    // 2. User Role (read-only for products/employees)
    const userPermissions = {
      users: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
      enterprises: { create: false, read: true, update: false, delete: false },
      employees: { create: false, read: true, update: false, delete: false },
      products: { create: false, read: true, update: false, delete: false },
    };
    const userRole = await Role.create({
      name: 'User',
      permissions: userPermissions,
    });

    console.log('Roles Created...');

    // --- Create Admin User ---
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: adminRole._id,
    });
    await adminUser.save();

    console.log('Admin User Created...');
    console.log('---');
    console.log('Admin Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('---');

    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedData();
