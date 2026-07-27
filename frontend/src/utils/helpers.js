// Format a date string to human-readable
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};

// Format time to 12-hour AM/PM
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

// Clamp a number between min and max
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Format fee display
export const formatFee = (fee) => `$${fee}`;

// Get initials from name
export const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';

// Debounce function
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

// Validate email
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate phone
export const isValidPhone = (phone) =>
  /^\+?[\d\s\-()]{7,15}$/.test(phone);

// Generate a random avatar seed
export const avatarUrl = (seed, bg = 'b6e3f4') =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=${bg}`;
