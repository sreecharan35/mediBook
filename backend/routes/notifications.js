const router = require('express').Router();

// POST /api/notifications/contact — handles contact form submissions
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  // In production: send email via Nodemailer / Resend / SendGrid
  console.log('[Contact Form]', { name, email, subject, message });
  res.json({ success: true, message: 'Your message has been received. We\'ll respond within 24 hours.' });
});

// POST /api/notifications/subscribe — newsletter subscription
router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  console.log('[Newsletter] New subscriber:', email);
  res.json({ success: true, message: 'Thanks for subscribing!' });
});

module.exports = router;
