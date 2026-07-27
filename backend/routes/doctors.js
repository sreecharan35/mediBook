const router = require('express').Router();
const { getAllDoctors, getDoctorById, getAvailableSlots, createDoctor } = require('../controllers/doctorController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, requireRole('admin'), createDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getAvailableSlots);

module.exports = router;
