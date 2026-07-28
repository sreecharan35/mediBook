import { motion } from 'framer-motion';
import {
  Calendar, Sparkles, ChevronRight, Star,
  Heart, Activity, Shield, Clock, Stethoscope,
  CheckCircle, ArrowRight
} from 'lucide-react';
import DNABackground from '../../../components/ui/DNABackground';

const floatingIcons = [
  { icon: Heart, color: '#ef4444', bg: 'linear-gradient(135deg,#ef4444,#f97316)', label: '❤️', delay: 0, x: '-28px', y: '-18px', size: 60 },
  { icon: Activity, color: '#10b981', bg: 'linear-gradient(135deg,#10b981,#06b6d4)', label: '📈', delay: 0.3, x: 'calc(100% - 30px)', y: '50px', size: 52 },
  { icon: Shield, color: '#8b5cf6', bg: 'linear-gradient(135deg,#8b5cf6,#ec4899)', label: '🛡️', delay: 0.6, x: '-36px', y: 'calc(100% - 60px)', size: 48 },
  { icon: Clock, color: '#f59e0b', bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', label: '⏰', delay: 0.9, x: 'calc(100% - 20px)', y: 'calc(100% - 30px)', size: 44 },
];

const timeSlots = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00'];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] } }),
};

const Hero = () => (
  <section className="hero" id="home">
    {/* DNA animated background */}
    <DNABackground />

    {/* Background blobs */}
    <div className="hero-bg-blob blob-1" />
    <div className="hero-bg-blob blob-2" />
    <div className="hero-bg-blob blob-3" />

    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
      <div className="hero-content">
        {/* Left text */}
        <div className="hero-text">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge badge-blue">
              <Sparkles size={12} />
              AI-Powered Healthcare Platform
            </span>
          </motion.div>

          <motion.h1 className="hero-headline font-display" variants={fadeUp} initial="hidden" animate="show" custom={1}>
            Book Your{' '}
            <span className="text-gradient">Healthcare</span>
            {' '}Appointment in Minutes
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp} initial="hidden" animate="show" custom={2}>
            Smart healthcare scheduling powered by AI. Connect with verified doctors, manage records, and book appointments anytime — all in one place.
          </motion.p>

          <motion.div className="hero-buttons" variants={fadeUp} initial="hidden" animate="show" custom={3}>
            <motion.a
              href="#book"
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Calendar size={18} />
              Book Appointment
            </motion.a>
            <motion.a
              href="#doctors"
              className="btn btn-outline"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Doctors
              <ChevronRight size={18} />
            </motion.a>
          </motion.div>

          <motion.div className="hero-stats" variants={fadeUp} initial="hidden" animate="show" custom={4}>
            {[
              { value: '1500+', label: 'Verified Doctors' },
              { value: '50K+', label: 'Patients Served' },
              { value: '4.9', label: 'Average Rating' },
            ].map((s, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right visual */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="hero-illustration-wrap">
            {/* Floating Icons */}
            {floatingIcons.map((item, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  width: item.size,
                  height: item.size,
                  borderRadius: 14,
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  zIndex: 10,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + item.delay, type: 'spring', bounce: 0.5 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' }}
                >
                  <item.icon size={item.size * 0.44} color="white" fill="white" />
                </motion.div>
              </motion.div>
            ))}

            {/* Main appointment card */}
            <motion.div
              className="hero-main-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1rem', marginBottom: '0.15rem' }}>Book Appointment</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Choose a doctor & time slot</div>
                </div>
                <span className="ai-chip">
                  <Sparkles size={11} />
                  AI Assisted
                </span>
              </div>

              {/* Doctor preview */}
              <div className="appt-doctor">
                <img
                  src="https://api.dicebear.com/7.x/personas/svg?seed=sarah&backgroundColor=b6e3f4"
                  alt="Dr. Sarah Mitchell"
                  className="appt-doctor-img"
                />
                <div style={{ flex: 1 }}>
                  <div className="appt-doctor-name">Dr. Sarah Mitchell</div>
                  <div className="appt-doctor-spec">Cardiologist · MediCore</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={10} fill="#f59e0b" color="#f59e0b" />
                    ))}
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 4 }}>4.9 (324)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--brand-600)' }}>$120</div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                    <CheckCircle size={10} />
                    Available
                  </span>
                </div>
              </div>

              {/* Time slots */}
              <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Select Time Slot
              </div>
              <div className="appt-slots">
                {timeSlots.map((slot, i) => (
                  <motion.div
                    key={slot}
                    className={`appt-slot ${i === 2 ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {slot}
                  </motion.div>
                ))}
              </div>

              {/* Book button */}
              <motion.button
                className="appt-btn"
                style={{ marginTop: '1rem' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar size={16} />
                Confirm Booking
              </motion.button>
            </motion.div>

            {/* Mini notification card */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-10px',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.8rem',
                zIndex: 20,
                maxWidth: '200px',
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={17} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, lineHeight: 1.3 }}>Appointment Confirmed!</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Today · 11:00 AM</div>
              </div>
            </motion.div>

            {/* Trusted badge */}
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '-16px',
                transform: 'translateY(-50%)',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '0.75rem 0.9rem',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                zIndex: 20,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <div style={{ color: 'var(--text-primary)' }}>Trusted by 50K+</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
