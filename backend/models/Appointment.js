const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
  },
  patient: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
  },
  type: {
    type: String,
    default: 'in-person'
  },
  status: {
    type: String,
    enum: ['Pending', 'confirmed', 'cancelled', 'rescheduled'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
  },
  cancelledAt: {
    type: Date,
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
