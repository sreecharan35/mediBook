import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isPastDate, isSunday, getBookedSlotsForDay, ALL_TIME_SLOTS } from '../../../utils/appointmentUtils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

/**
 * BookingCalendar — custom month calendar with booked slot awareness
 * Props:
 *   value      — selected date string (YYYY-MM-DD)
 *   onChange   — callback(dateStr)
 *   doctorId   — to look up booked slots per doctor
 */
const BookingCalendar = ({ value, onChange, doctorId }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day) => {
    if (isPastDate(viewYear, viewMonth, day)) return;
    if (isSunday(viewYear, viewMonth, day)) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
  };

  const getDateStr = (day) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getAvailability = (day) => {
    const dateStr = getDateStr(day);
    const booked = getBookedSlotsForDay(doctorId, dateStr);
    const pct = booked.length / ALL_TIME_SLOTS.length;
    if (pct >= 1) return 'full';
    if (pct >= 0.6) return 'busy';
    return 'available';
  };

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day) => {
    const t = new Date();
    return day === t.getDate() && viewMonth === t.getMonth() && viewYear === t.getFullYear();
  };

  const isSelected = (day) => {
    const dateStr = getDateStr(day);
    return dateStr === value;
  };

  // Disable: past dates or Sundays
  const isDisabled = (day) =>
    isPastDate(viewYear, viewMonth, day) || isSunday(viewYear, viewMonth, day);

  return (
    <div className="booking-calendar">
      {/* Header */}
      <div className="cal-header">
        <motion.button
          type="button"
          className="cal-nav-btn"
          onClick={prevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={18} />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.h3
            key={`${viewYear}-${viewMonth}`}
            className="cal-month-label"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            {MONTHS[viewMonth]} {viewYear}
          </motion.h3>
        </AnimatePresence>

        <motion.button
          type="button"
          className="cal-nav-btn"
          onClick={nextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Day headers */}
      <div className="cal-days-header">
        {DAYS.map(d => (
          <div key={d} className={`cal-day-name ${d === 'Sun' ? 'cal-sunday' : ''}`}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewYear}-${viewMonth}`}
          className="cal-grid"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const disabled = isDisabled(day);
            const selected = isSelected(day);
            const today = isToday(day);
            const avail = !disabled ? getAvailability(day) : null;

            return (
              <motion.button
                key={day}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={disabled}
                className={[
                  'cal-day',
                  disabled ? 'cal-day-disabled' : '',
                  selected ? 'cal-day-selected' : '',
                  today && !selected ? 'cal-day-today' : '',
                  avail === 'full' && !selected ? 'cal-day-full' : '',
                ].join(' ')}
                whileHover={!disabled ? { scale: 1.1 } : {}}
                whileTap={!disabled ? { scale: 0.95 } : {}}
              >
                <span>{day}</span>
                {!disabled && avail && (
                  <span className={`cal-dot cal-dot-${avail}`} />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="cal-legend">
        <span className="cal-legend-item"><span className="cal-dot cal-dot-available" />Available</span>
        <span className="cal-legend-item"><span className="cal-dot cal-dot-busy" />Filling up</span>
        <span className="cal-legend-item"><span className="cal-dot cal-dot-full" />Full</span>
      </div>
    </div>
  );
};

export default BookingCalendar;
