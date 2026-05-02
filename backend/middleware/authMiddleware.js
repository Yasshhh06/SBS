const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const adminDoc = await db.collection('admins').doc(decoded.id).get();
      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        delete adminData.password;
        req.admin = { _id: adminDoc.id, ...adminData };
        next();
      } else {
        res.status(401).json({ message: 'Not authorized, admin not found' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
