import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle, Award } from 'lucide-react';

/**
 * DoctorCard — selectable doctor card for Step 2
 * Props:
 *   doctor     — doctor data object
 *   selected   — boolean
 *   onSelect   — callback(doctor)
 */
const DoctorCard = ({ doctor, selected, onSelect }) => (
  <motion.div
    onClick={() => onSelect(doctor)}
    className={`booking-doctor-card ${selected ? 'selected' : ''}`}
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.99 }}
    layout
  >
    {/* Selection indicator */}
    <div className={`doctor-select-ring ${selected ? 'active' : ''}`}>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="doctor-selected-check"
        >
          <CheckCircle size={18} color="white" />
        </motion.div>
      )}
    </div>

    {/* Doctor info */}
    <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={doctor.image}
          alt={doctor.name}
          className="booking-doctor-avatar"
        />
        <span className="availability-dot" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h4 className="booking-doctor-name">{doctor.name}</h4>
          {doctor.badge && (
            <span className="badge-sm">
              <Award size={10} /> {doctor.badge}
            </span>
          )}
        </div>

        <p className="booking-doctor-spec">{doctor.specialty}</p>

        <div className="booking-doctor-meta">
          <span><Clock size={11} /> {doctor.experience} exp</span>
          <span>
            <Star size={11} fill="#f59e0b" color="#f59e0b" />
            {doctor.rating} ({doctor.reviews})
          </span>
          <span><MapPin size={11} /> {doctor.hospital}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
          <div className="booking-doctor-langs">
            {doctor.languages.map(l => (
              <span key={l} className="lang-chip">{l}</span>
            ))}
          </div>
          <div className="booking-doctor-fee">
            ₹{(doctor.fee * 83).toLocaleString('en-IN')}
            <span className="fee-unit"> / visit</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default DoctorCard;
