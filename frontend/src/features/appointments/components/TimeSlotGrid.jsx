import { motion } from 'framer-motion';
import { isSlotBooked, ALL_TIME_SLOTS } from '../../../utils/appointmentUtils';

/**
 * TimeSlotGrid — grid of selectable time slots with booked state
 * Props:
 *   doctorId  — to check booked slots
 *   date      — selected date (YYYY-MM-DD)
 *   value     — currently selected time
 *   onChange  — callback(time)
 */
const TimeSlotGrid = ({ doctorId, date, value, onChange }) => {
  if (!date) {
    return (
      <div className="slot-empty-state">
        <span>📅</span>
        <p>Select a date first to see available time slots</p>
      </div>
    );
  }

  const morningSlots = ALL_TIME_SLOTS.filter(s => s.value < '12:00');
  const afternoonSlots = ALL_TIME_SLOTS.filter(s => s.value >= '12:00');

  const SlotButton = ({ slot }) => {
    const booked = isSlotBooked(doctorId, date, slot.value);
    const selected = value === slot.value;

    return (
      <motion.button
        type="button"
        disabled={booked}
        onClick={() => !booked && onChange(slot.value)}
        className={[
          'time-slot',
          booked ? 'slot-booked' : '',
          selected ? 'slot-selected' : '',
        ].join(' ')}
        whileHover={!booked ? { scale: 1.06, y: -2 } : {}}
        whileTap={!booked ? { scale: 0.95 } : {}}
        title={booked ? 'This slot is already booked' : slot.label}
      >
        {slot.label}
        {booked && <span className="slot-booked-tag">Booked</span>}
        {selected && <span className="slot-selected-dot" />}
      </motion.button>
    );
  };

  const available = ALL_TIME_SLOTS.filter(s => !isSlotBooked(doctorId, date, s.value)).length;

  return (
    <div className="time-slot-grid-wrap">
      <div className="slot-availability-bar">
        <span className="slot-avail-label">
          <span className="avail-count">{available}</span> of {ALL_TIME_SLOTS.length} slots available
        </span>
        <div className="avail-bar-track">
          <motion.div
            className="avail-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(available / ALL_TIME_SLOTS.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>

      <div className="slot-section">
        <p className="slot-section-label">🌅 Morning</p>
        <div className="slot-grid">
          {morningSlots.map(slot => <SlotButton key={slot.value} slot={slot} />)}
        </div>
      </div>

      <div className="slot-section">
        <p className="slot-section-label">☀️ Afternoon</p>
        <div className="slot-grid">
          {afternoonSlots.map(slot => <SlotButton key={slot.value} slot={slot} />)}
        </div>
      </div>

      <div className="slot-legend">
        <span className="slot-legend-item slot-legend-available">Available</span>
        <span className="slot-legend-item slot-legend-selected">Selected</span>
        <span className="slot-legend-item slot-legend-booked">Booked</span>
      </div>
    </div>
  );
};

export default TimeSlotGrid;
