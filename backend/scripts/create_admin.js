const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { db } = require('../config/db');

dotenv.config();

const createAdmin = async () => {
  try {
    const adminEmail = 'admin@sbs.com';
    const adminPassword = 'admin'; // You can change this
    const adminName = 'Admin';

    // Check if admin already exists
    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef.where('email', '==', adminEmail).get();

    if (!snapshot.empty) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    await adminsRef.add({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`Admin created successfully! Email: ${adminEmail}, Password: ${adminPassword}`);
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
