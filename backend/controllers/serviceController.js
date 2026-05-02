const { db } = require('../config/db');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const snapshot = await db.collection('services').get();
    const services = [];
    snapshot.forEach(doc => {
      services.push({ _id: doc.id, ...doc.data() });
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  const { name, category, description, price, duration } = req.body;

  try {
    const serviceData = {
      name,
      category: category || 'General',
      description: description || '',
      price,
      duration,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('services').add(serviceData);
    const createdService = { _id: docRef.id, ...serviceData };
    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getServices, createService };
