const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/users
// @desc Get all users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  // map _id to id
  const formattedUsers = users.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }));
  res.json(formattedUsers);
});

// PUT /api/users/:id/role
// @desc Update user role (Admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['patient', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role provided' });
  }

  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent admin from removing their own admin status easily if desired, 
  // but for now we'll allow flexibility
  user.role = role;
  await user.save();

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

module.exports = { getAllUsers, updateUserRole };
