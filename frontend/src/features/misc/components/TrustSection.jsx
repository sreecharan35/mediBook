import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShieldCheck, Award, Lock, BadgeCheck, Zap, Globe } from 'lucide-react';

const partners = [
  { name: 'Apollo Hospitals', logo: '🏥', color: '#2563eb' },
  { name: 'Fortis Healthcare', logo: '⚕️', color: '#7c3aed' },
  { name: 'AIIMS', logo: '🔬', color: '#059669' },
  { name: 'Max Hospital', logo: '💊', color: '#ea580c' },
  { name: 'Manipal Health', logo: '🩺', color: '#db2777' },
  { name: 'Narayana Health', logo: '❤️', color: '#0891b2' },
];

const certifications = [
  { icon: ShieldCheck, label: 'HIPAA Compliant', color: '#10b981' },
  { icon: Lock, label: '256-bit Encryption', color: '#2563eb' },
  { icon: Award, label: 'ISO 27001 Certified', color: '#f59e0b' },
  { icon: BadgeCheck, label: 'Verified Doctors', color: '#7c3aed' },
  { icon: Zap, label: '99.9% Uptime SLA', color: '#ea580c' },
  { icon: Globe, label: 'GDPR Ready', color: '#0891b2' },
];

const TrustSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="trust-section section-padding" id="partners" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-blue">Trusted Partners</span>
          <h2 className="section-title">
            Backed by Leading{' '}
            <span className="text-gradient">Healthcare Networks</span>
          </h2>
          <p>We partner with India's top hospital networks and comply with global healthcare security standards.</p>
        </motion.div>

        {/* Partners logos */}
        <motion.div
          className="partners-grid"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              className="partner-card glass-card"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
              whileHover={{ y: -5, scale: 1.03 }}
            >
              <div
                className="partner-logo"
                style={{ background: `${partner.color}18`, border: `1.5px solid ${partner.color}30` }}
              >
                <span style={{ fontSize: '2rem' }}>{partner.logo}</span>
              </div>
              <div className="partner-name">{partner.name}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications strip */}
        <motion.div
          className="cert-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="cert-label">Security &amp; Compliance</div>
          <div className="cert-list">
            {certifications.map((cert, i) => {
              const Icon = cert.icon;
              return (
                <motion.div
                  key={cert.label}
                  className="cert-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.07 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon size={15} color={cert.color} />
                  <span>{cert.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
