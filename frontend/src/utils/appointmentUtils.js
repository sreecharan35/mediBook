// ─── Appointment ID Generator ──────────────────────────────────
let sequenceCounter = parseInt(localStorage.getItem('apt_seq') || '0');

export const generateAppointmentId = () => {
  sequenceCounter += 1;
  localStorage.setItem('apt_seq', String(sequenceCounter));
  const year = new Date().getFullYear();
  const seq = String(sequenceCounter).padStart(4, '0');
  return `APT-${year}-${seq}`;
};

// ─── Booked Slots Mock Data ────────────────────────────────────
// Key: `${doctorId}-${YYYY-MM-DD}`  Value: string[] of booked times
const generateBookedSlots = () => {
  const today = new Date();
  const slots = {};
  // Seed some booked slots for the next 14 days
  for (let doctorId = 1; doctorId <= 6; doctorId++) {
    for (let d = 1; d <= 14; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      if (date.getDay() === 0) continue; // skip Sundays
      const key = `${doctorId}-${date.toISOString().split('T')[0]}`;
      const allSlots = ALL_TIME_SLOTS.map(s => s.value);
      // Randomly book 30–50% of slots
      slots[key] = allSlots.filter(() => Math.random() < 0.35);
    }
  }
  return slots;
};

export const ALL_TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '09:30', label: '9:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
];

// Seeded once per session
export const BOOKED_SLOTS = generateBookedSlots();

export const getBookedSlotsForDay = (doctorId, dateStr) => {
  return BOOKED_SLOTS[`${doctorId}-${dateStr}`] || [];
};

export const isSlotBooked = (doctorId, dateStr, time) => {
  return getBookedSlotsForDay(doctorId, dateStr).includes(time);
};

// ─── Date helpers ──────────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const slot = ALL_TIME_SLOTS.find(s => s.value === timeStr);
  return slot ? slot.label : timeStr;
};

export const isPastDate = (year, month, day) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(year, month, day);
  return d < today;
};

export const isSunday = (year, month, day) => {
  return new Date(year, month, day).getDay() === 0;
};
