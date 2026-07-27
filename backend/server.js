const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./db/mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ── Security & Middleware ──────────────────────────────────────
app.use(helmet());
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const normalizedClientUrl = clientUrl.endsWith('/') ? clientUrl.slice(0, -1) : clientUrl;

app.use(cors({ origin: [normalizedClientUrl, normalizedClientUrl + '/'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ──────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// ── Health Check ───────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// ── n8n Webhook Receiver ───────────────────────────────────────
app.post('/webhook/appointment-confirmed', (req, res) => {
  console.log('[n8n webhook] appointment-confirmed:', req.body);
  res.json({ received: true });
});

app.post('/webhook/appointment-reminder', (req, res) => {
  console.log('[n8n webhook] appointment-reminder:', req.body);
  res.json({ received: true });
});

// ── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.originalUrl} not found` }));

// ── Global Error Handler ───────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🏥 MediBook API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
