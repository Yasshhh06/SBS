const express = require('express');
const router = express.Router();
const { authAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.get('/me', protect, getAdminProfile);

module.exports = router;
