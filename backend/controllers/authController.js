const { db } = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const authAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);
    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log(`Login failed for: ${email} - Invalid credentials`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let adminDoc = null;
    snapshot.forEach(doc => {
      adminDoc = { id: doc.id, ...doc.data() };
    });

    const isMatch = await bcrypt.compare(password, adminDoc.password);

    if (isMatch) {
      console.log(`Login successful for: ${email}`);
      res.json({
        _id: adminDoc.id,
        name: adminDoc.name,
        email: adminDoc.email,
        token: generateToken(adminDoc.id),
      });
    } else {
      console.log(`Login failed for: ${email} - Invalid credentials`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`Login error for ${email}:`, error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/me
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const adminRef = db.collection('admins').doc(req.admin._id);
    const doc = await adminRef.get();

    if (doc.exists) {
      const adminData = doc.data();
      res.json({
        _id: doc.id,
        name: adminData.name,
        email: adminData.email,
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authAdmin, getAdminProfile };
