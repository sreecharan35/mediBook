const router = require('express').Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/auth');

// All routes here are protected and require admin role
router.use(protect);
router.use(requireRole('admin'));

router.route('/')
  .get(getAllUsers);

router.route('/:id/role')
  .put(updateUserRole);

module.exports = router;
