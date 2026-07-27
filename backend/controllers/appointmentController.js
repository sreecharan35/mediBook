const Appointment = require('../models/Appointment');
const { asyncHandler } = require('../middleware/errorHandler');
const axios = require('axios').default;

// POST /api/appointments
const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, doctorName, specialty, date, time, patientName, patientEmail, patientPhone, reason, type = 'in-person' } = req.body;
  if (!doctorId || !date || !time || !patientName || !patientEmail) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const confirmationCode = `MB-${Date.now().toString(36).toUpperCase()}`;

  const appointment = await Appointment.create({
    doctorId, doctorName, specialty, date, time,
    patient: { name: patientName, email: patientEmail, phone: patientPhone, userId: req.user ? req.user.id : undefined },
    reason, type, status: 'confirmed',
    confirmationCode
  });

  // Map _id to id for frontend compatibility
  const formattedAppointment = { ...appointment._doc, id: appointment._id };

  // Trigger n8n workflow (fire & forget)
  triggerN8nWebhook('appointment-booked', formattedAppointment).catch(console.error);

  res.status(201).json({ success: true, appointment: formattedAppointment });
});

// GET /api/appointments
const getAppointments = asyncHandler(async (req, res) => {
  const { status, patientEmail } = req.query;
  let query = {};
  if (status) query.status = status;
  if (patientEmail) query['patient.email'] = patientEmail;
  
  // If user is logged in, restrict to their appointments unless they are admin/doctor
  if (req.user && req.user.role === 'patient') {
    query['patient.userId'] = req.user.id;
  }
  
  const appointments = await Appointment.find(query).sort('-createdAt');
  const formattedAppointments = appointments.map(a => ({ ...a._doc, id: a._id }));
  res.json({ count: formattedAppointments.length, appointments: formattedAppointments });
});

// GET /api/appointments/:id
const getAppointmentById = asyncHandler(async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found.' });
    res.json({ ...appt._doc, id: appt._id });
  } catch (error) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }
});

// PATCH /api/appointments/:id/cancel
const cancelAppointment = asyncHandler(async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found.' });
    
    appt.status = 'cancelled';
    appt.cancelledAt = new Date();
    await appt.save();

    const formattedAppointment = { ...appt._doc, id: appt._id };
    triggerN8nWebhook('appointment-cancelled', formattedAppointment).catch(console.error);
    res.json({ success: true, appointment: formattedAppointment });
  } catch (error) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }
});

// PATCH /api/appointments/:id/reschedule
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { date, time } = req.body;
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found.' });
    
    appt.date = date;
    appt.time = time;
    appt.status = 'rescheduled';
    await appt.save();

    const formattedAppointment = { ...appt._doc, id: appt._id };
    triggerN8nWebhook('appointment-rescheduled', formattedAppointment).catch(console.error);
    res.json({ success: true, appointment: formattedAppointment });
  } catch (error) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }
});

// Helper: fire n8n webhook
async function triggerN8nWebhook(event, data) {
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (!n8nUrl) return;
  await axios.post(`${n8nUrl}/${event}`, { event, data, timestamp: new Date().toISOString() });
}

module.exports = { createAppointment, getAppointments, getAppointmentById, cancelAppointment, rescheduleAppointment };
