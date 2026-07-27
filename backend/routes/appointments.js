const router = require('express').Router();
const {
  createAppointment, getAppointments, getAppointmentById,
  cancelAppointment, rescheduleAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.post('/', createAppointment);                         // public (guest booking)
router.get('/', protect, getAppointments);                   // auth required
router.get('/:id', protect, getAppointmentById);             // auth required
router.patch('/:id/cancel', protect, cancelAppointment);     // auth required
router.patch('/:id/reschedule', protect, rescheduleAppointment); // auth required

module.exports = router;
