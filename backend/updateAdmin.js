require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./db/mongoose');

const updateAdmin = async () => {
  await connectDB();
  const user = await User.findOneAndUpdate(
    { email: 'sreecharan8354@gmail.com' },
    { role: 'admin' },
    { new: true }
  );
  if (user) {
    console.log('Successfully updated user to admin:', user.email);
  } else {
    console.log('User not found. They will be made admin upon registration.');
  }
  process.exit(0);
};

updateAdmin();
