const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAppointments).post(protect, createAppointment);
router.route('/:id').delete(protect, deleteAppointment).put(protect, updateAppointment);
router.route('/:id/status').patch(protect, updateAppointmentStatus);

module.exports = router;
