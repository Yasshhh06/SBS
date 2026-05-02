const express = require('express');
const router = express.Router();
const { getServices, createService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getServices).post(protect, createService);

module.exports = router;
