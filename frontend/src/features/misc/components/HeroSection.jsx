import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, Star, ChevronRight,
  Sparkles, Shield, Clock, CheckCircle, ArrowRight,
  Heart, Activity, Stethoscope, UserCheck
} from 'lucide-react';
import { doctors } from '../../../data/doctors';

const specialties = [
  'All Specialties', 'Cardiologist', 'Neurologist', 'Pediatrician',
  'Orthopedic', 'Dermatologist', 'General Physician'
];

const floatingBadges = [
  { icon: CheckCircle, label: 'Verified Doctors', value: '1500+', color: '#10b981', bg: 'rgba(16,185,129,0.12)', delay: 0 },
  { icon: Star, label: 'Avg. Rating', value: '4.9 ★', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', delay: 0.2 },
  { icon: Shield, label: 'HIPAA Secure', value: '100%', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', delay: 0.4 },
  { icon: Clock, label: 'Available Now', value: '24/7', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', delay: 0.6 },
];

const quickSearchTags = [
  '❤️ Heart', '🧠 Brain', '👶 Child', '🦴 Bones', '🌿 Skin', '🩺 General'
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  }),
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All Specialties');
  const [activeTag, setActiveTag] = useState(null);

  // Show first 4 doctors in the visual grid
  const featured = doctors.slice(0, 4);

  return (
    <section className="new-hero" id="home">
      {/* Gradient orbs */}
      <div className="nh-orb nh-orb-1" />
      <div className="nh-orb nh-orb-2" />
      <div className="nh-orb nh-orb-3" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="nh-layout">

          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div className="nh-left">

            {/* Badge */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <span className="badge badge-blue" style={{ fontSize: '0.78rem', padding: '0.4rem 1rem' }}>
                <Sparkles size={12} />
                AI-Powered Healthcare Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 className="nh-headline" variants={fadeUp} initial="hidden" animate="show" custom={1}>
              Find &amp; Book the{' '}
              <span className="text-gradient">Right Doctor</span>{' '}
              Near You
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="nh-subtitle" variants={fadeUp} initial="hidden" animate="show" custom={2}>
              Connect with 1500+ verified specialists across 200+ hospitals. Smart AI matching, instant booking, and 24/7 healthcare support — all in one place.
            </motion.p>

            {/* ── Search Bar ── */}
            <motion.div className="nh-search-card" variants={fadeUp} initial="hidden" animate="show" custom={3}>
              <div className="nh-search-row">
                {/* Specialty dropdown */}
                <div className="nh-search-field nh-field-spec">
                  <Stethoscope size={16} className="nh-field-icon" />
                  <select
                    className="nh-select"
                    value={selectedSpec}
                    onChange={e => setSelectedSpec(e.target.value)}
                  >
                    {specialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="nh-search-divider" />

                {/* Name / keyword */}
                <div className="nh-search-field nh-field-query">
                  <Search size={16} className="nh-field-icon" />
                  <input
                    className="nh-input"
                    placeholder="Doctor name or condition..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="nh-search-divider" />

                {/* Location */}
                <div className="nh-search-field nh-field-loc">
                  <MapPin size={16} className="nh-field-icon" />
                  <input className="nh-input" placeholder="Location" defaultValue="Your city" />
                </div>

                {/* CTA */}
                <motion.button
                  className="nh-search-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Search size={18} />
                  Search
                </motion.button>
              </div>

              {/* Quick tags */}
              <div className="nh-tags">
                <span className="nh-tags-label">Quick:</span>
                {quickSearchTags.map(tag => (
                  <motion.button
                    key={tag}
                    className={`nh-tag ${activeTag === tag ? 'active' : ''}`}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Floating trust badges */}
            <motion.div className="nh-badges" variants={fadeUp} initial="hidden" animate="show" custom={4}>
              {floatingBadges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.label}
                    className="nh-badge-pill"
                    style={{ background: b.bg, borderColor: `${b.color}30` }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + b.delay, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Icon size={14} color={b.color} />
                    <div className="nh-badge-text">
                      <span className="nh-badge-value" style={{ color: b.color }}>{b.value}</span>
                      <span className="nh-badge-label">{b.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA buttons */}
            <motion.div className="nh-ctas" variants={fadeUp} initial="hidden" animate="show" custom={5}>
              <motion.a
                href="/book"
                className="btn btn-primary"
                style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Calendar size={18} /> Book Appointment
              </motion.a>
              <motion.a
                href="/doctors"
                className="btn btn-outline"
                style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Doctors <ChevronRight size={18} />
              </motion.a>
            </motion.div>

            {/* Social proof avatars */}
            <motion.div
              className="nh-social-proof"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <div className="nh-avatar-stack">
                {['patient-a', 'patient-b', 'patient-c', 'patient-d'].map((seed, i) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,d1f4cc,ffd5dc,c0aede`}
                    alt="Patient"
                    className="nh-avatar-face"
                    style={{ zIndex: 4 - i, marginLeft: i === 0 ? 0 : '-10px' }}
                  />
                ))}
              </div>
              <div className="nh-proof-text">
                <span className="nh-proof-bold">50,000+ patients</span>
                <span className="nh-proof-sub">trust MediBook every month</span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Doctor Cards Grid ── */}
          <motion.div
            className="nh-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Floating accent card — top left */}
            <motion.div
              className="nh-accent-card nh-accent-top"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className="nh-accent-icon" style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }}>
                <Activity size={16} color="white" />
              </div>
              <div>
                <div className="nh-accent-title">Appointment Confirmed</div>
                <div className="nh-accent-sub">Today · 11:00 AM</div>
              </div>
              <CheckCircle size={18} color="#10b981" style={{ marginLeft: 'auto' }} />
            </motion.div>

            {/* Doctor cards 2×2 grid */}
            <div className="nh-cards-grid">
              {featured.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  className="nh-doc-card glass-card"
                  initial={{ opacity: 0, y: 30, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(37,99,235,0.18)' }}
                >
                  <div className="nh-doc-top">
                    <img
                      src={doc.image || `https://api.dicebear.com/7.x/personas/svg?seed=doc${doc.id}&backgroundColor=b6e3f4`}
                      alt={doc.name}
                      className="nh-doc-avatar"
                    />
                    <span className="nh-doc-badge">{doc.badge}</span>
                  </div>
                  <div className="nh-doc-name">{doc.name}</div>
                  <div className="nh-doc-spec">{doc.specialty}</div>
                  <div className="nh-doc-meta">
                    <span className="nh-doc-rating">
                      <Star size={10} fill="#f59e0b" color="#f59e0b" />
                      {doc.rating}
                    </span>
                    <span className="nh-doc-fee">{doc.fee}</span>
                  </div>
                  <motion.button
                    className="nh-doc-btn"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Calendar size={12} /> Book
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Floating accent card — bottom right */}
            <motion.div
              className="nh-accent-card nh-accent-bottom"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="nh-accent-icon" style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}>
                <UserCheck size={16} color="white" />
              </div>
              <div>
                <div className="nh-accent-title">New Doctor Joined</div>
                <div className="nh-accent-sub">Dr. Priya Sharma · Oncologist</div>
              </div>
            </motion.div>

            {/* Pulsing live indicator */}
            <motion.div
              className="nh-live-pill"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
            >
              <span className="nh-live-dot" />
              <span>247 doctors online now</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
