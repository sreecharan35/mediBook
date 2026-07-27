const router = require('express').Router();
const { getAllDoctors, getDoctorById, getAvailableSlots, createDoctor, deleteDoctor, updateDoctor } = require('../controllers/doctorController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, requireRole('admin'), createDoctor);
router.put('/:id', protect, requireRole('admin'), updateDoctor);
router.delete('/:id', protect, requireRole('admin'), deleteDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getAvailableSlots);

module.exports = router;
