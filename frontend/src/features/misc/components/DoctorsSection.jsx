import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctors } from '../../../data/doctors';

const specialties = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Dermatologist', 'General Physician'];

const DoctorCard = ({ doctor, index }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      className="glass-card doctor-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      layout
    >
      <div className="doctor-card-top">
        <motion.img
          src={doctor.image}
          alt={doctor.name}
          className="doctor-avatar"
          whileHover={{ scale: 1.05 }}
        />
        <div style={{ flex: 1 }}>
          <div className="doctor-name">{doctor.name}</div>
          <div className="doctor-spec">{doctor.specialty}</div>
          <div className="doctor-exp">{doctor.experience} experience</div>
          <div className="doctor-rating-row" style={{ marginTop: '0.4rem' }}>
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span className="rating-val">{doctor.rating}</span>
            <span>({doctor.reviews} reviews)</span>
          </div>
        </div>
        <div className="doctor-badge">{doctor.badge}</div>
      </div>

      <div className="doctor-info-row">
        <MapPin size={14} />
        <span>{doctor.hospital}</span>
      </div>
      <div className="doctor-info-row">
        <Clock size={14} />
        <span>{doctor.availability}</span>
      </div>
      <div className="doctor-info-row">
        <CheckCircle size={14} />
        <span>Available · {doctor.languages.join(', ')}</span>
      </div>

      <div className="doctor-divider" />

      <div className="doctor-footer">
        <div className="doctor-fee">
          {doctor.fee}
          <span> / session</span>
        </div>
        <motion.button
          className="book-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} /> Book Now
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const DoctorsSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const navigate = useNavigate();

  const filtered = activeFilter === 'All'
    ? doctors
    : doctors.filter(d => d.specialty === activeFilter);

  return (
    <section className="doctors-section section-padding" id="doctors" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-blue">Top Specialists</span>
          <h2 className="section-title">
            Meet Our{' '}
            <span className="text-gradient">Featured Doctors</span>
          </h2>
          <p>All doctors are verified, board-certified specialists committed to your health and well-being.</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="filter-tabs"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {specialties.map((spec) => (
            <motion.button
              key={spec}
              className={`filter-tab ${activeFilter === spec ? 'active' : ''}`}
              onClick={() => setActiveFilter(spec)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {spec}
            </motion.button>
          ))}
        </motion.div>

        {/* Doctors grid */}
        <motion.div className="doctors-grid" layout>
          <AnimatePresence>
            {filtered.map((doctor, i) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          style={{ textAlign: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/doctors')}
            className="btn btn-outline"
            style={{ padding: '0.8rem 2rem', display: 'inline-block' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View All Doctors
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorsSection;
