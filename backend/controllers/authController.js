const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'medibook_secret', { expiresIn: '7d' });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  let { name, email, password, role = 'patient' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  // Force specific email to be admin
  if (email.toLowerCase() === 'sreecharan8354@gmail.com') {
    role = 'admin';
  }
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const user = await User.create({ name, email, password, role });
  
  if (user) {
    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials.' });
  }
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

// POST /api/auth/google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'placeholder');

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Google credential missing' });
  }

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || 'placeholder'
    });
  } catch (err) {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(credential);
    console.error('--- AUDIENCE MISMATCH ---');
    console.error('Expected Audience (Backend .env):', process.env.GOOGLE_CLIENT_ID);
    console.error('Actual Audience (Frontend Token):', decoded?.aud);
    console.error('-------------------------');
    throw err;
  }

  const payload = ticket.getPayload();
  const { email, name, sub } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    // Determine if admin
    let role = 'patient';
    if (email.toLowerCase() === 'sreecharan8354@gmail.com') {
      role = 'admin';
    }

    user = await User.create({
      name,
      email,
      role,
      authProvider: 'google',
      googleId: sub
    });
  } else {
    // If the user already exists, update their google info just in case
    if (user.authProvider === 'local') {
      user.authProvider = 'google';
      user.googleId = sub;
      await user.save();
    }
  }

  // Always enforce admin role for the designated admin email
  if (email.toLowerCase() === 'sreecharan8354@gmail.com' && user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
  }

  res.json({
    token: generateToken(user._id, user.role),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, picture: payload.picture }
  });
});

module.exports = { register, login, getMe, googleLogin };
