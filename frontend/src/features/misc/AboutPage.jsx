import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Target, Users, Award, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Dr. Alex Morgan', role: 'CEO & Co-Founder', specialty: 'Healthcare Tech', image: 'https://api.dicebear.com/7.x/personas/svg?seed=alex&backgroundColor=b6e3f4' },
  { name: 'Priya Sharma', role: 'CTO', specialty: 'AI & Machine Learning', image: 'https://api.dicebear.com/7.x/personas/svg?seed=priya&backgroundColor=c0aede' },
  { name: 'James Wilson', role: 'Head of Product', specialty: 'UX & Design', image: 'https://api.dicebear.com/7.x/personas/svg?seed=james2&backgroundColor=d1f4cc' },
  { name: 'Sofia Garcia', role: 'Chief Medical Officer', specialty: 'Clinical Operations', image: 'https://api.dicebear.com/7.x/personas/svg?seed=sofia&backgroundColor=ffd5dc' },
  { name: 'Marcus Lee', role: 'VP of Engineering', specialty: 'Backend Systems', image: 'https://api.dicebear.com/7.x/personas/svg?seed=marcus2&backgroundColor=ffdfbf' },
  { name: 'Aisha Patel', role: 'Head of Growth', specialty: 'Marketing & Partnerships', image: 'https://api.dicebear.com/7.x/personas/svg?seed=aisha2&backgroundColor=b6e3f4' },
];

const milestones = [
  { year: '2020', title: 'Founded', desc: 'MediBook started with a vision to make healthcare accessible to all.' },
  { year: '2021', title: 'First 10K Users', desc: 'Reached 10,000 patients within 8 months of launch.' },
  { year: '2022', title: 'AI Integration', desc: 'Launched AI-powered appointment matching & health recommendations.' },
  { year: '2023', title: '200 Hospitals', desc: 'Partnered with 200+ hospitals and clinics nationwide.' },
  { year: '2024', title: '50K+ Patients', desc: 'Serving over 50,000 patients with 1,500+ verified doctors.' },
  { year: '2025', title: 'Global Expansion', desc: 'Expanding to 10 new countries with multilingual support.' },
];

const values = [
  { icon: Heart, title: 'Patient First', desc: 'Every decision starts with what is best for the patient.', color: '#ef4444' },
  { icon: Target, title: 'Precision', desc: 'AI-driven accuracy in matching patients with the right care.', color: '#3b82f6' },
  { icon: Globe, title: 'Accessibility', desc: 'Healthcare should be available to everyone, everywhere.', color: '#10b981' },
  { icon: Award, title: 'Excellence', desc: 'We set the highest standards in healthcare technology.', color: '#f59e0b' },
];

const AboutPage = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <div style={{ paddingTop: '72px', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div style={{ background: 'var(--gradient-hero)', padding: '5rem 0 4rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>About Us</span>
            <h1 className="section-title">
              Reimagining Healthcare <span className="text-gradient">For Everyone</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 560, margin: '1rem auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              MediBook was born from the belief that finding and booking quality healthcare should be as easy as ordering food online.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <Link to="/book" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>Book Appointment</Link>
              <Link to="/contact" className="btn btn-outline" style={{ padding: '0.8rem 1.75rem' }}>Get in Touch</Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission */}
      <div id="mission" className="container" style={{ padding: '5rem 1.5rem' }} ref={ref}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.55 }}>
            <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Our Mission</span>
            <h2 className="section-title" style={{ textAlign: 'left', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              Making Quality Healthcare <span className="text-gradient">Accessible</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: '1.25rem 0' }}>
              We believe that navigating the healthcare system shouldn't be complicated. Our AI-powered platform removes friction from the appointment booking process, letting patients focus on what matters — their health.
            </p>
            {['HIPAA Compliant & Secure', 'AI-matched doctor recommendations', 'Available in 15+ languages', '200+ partner hospitals'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={15} style={{ color: '#10b981', flexShrink: 0 }} />{f}
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.55, delay: 0.1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {values.map((v, i) => (
                <motion.div key={v.title} className="glass-card" style={{ padding: '1.5rem' }} whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.08 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${v.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                    <v.icon size={20} style={{ color: v.color }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{v.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{v.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team */}
      <div id="team" style={{ background: 'var(--bg-secondary)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue">Our Team</span>
            <h2 className="section-title">Meet the <span className="text-gradient">People Behind</span> MediBook</h2>
            <p>A diverse team of healthcare professionals, engineers, and designers united by one mission.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {team.map((member, i) => (
              <motion.div key={member.name} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }} whileHover={{ y: -5 }}>
                <img src={member.image} alt={member.name} style={{ width: 80, height: 80, borderRadius: 20, margin: '0 auto 1rem', border: '3px solid rgba(59,130,246,0.2)' }} />
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{member.name}</div>
                <div style={{ color: 'var(--brand-600)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.2rem' }}>{member.role}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{member.specialty}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div id="story" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue">Our Story</span>
            <h2 className="section-title">The Journey <span className="text-gradient">So Far</span></h2>
          </div>
          <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--border-color)', transform: 'translateX(-50%)' }} />
            {milestones.map((m, i) => (
              <motion.div key={m.year} style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                  <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'inline-block', textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-600)', marginBottom: '0.25rem' }}>{m.title}</div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{m.desc}</div>
                  </div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 800, fontSize: '0.75rem', boxShadow: 'var(--shadow-brand)', zIndex: 1 }}>
                  {m.year.slice(2)}
                </div>
                <div style={{ flex: 1 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Careers CTA */}
      <div id="careers" style={{ background: 'var(--bg-secondary)', padding: '4rem 0' }}>
        <div className="container">
          <div className="cta-card">
            <motion.h2 className="cta-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Join Our Mission</motion.h2>
            <p className="cta-subtitle">We're hiring passionate people who want to transform healthcare.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-white" style={{ padding: '0.85rem 2rem', fontWeight: 700, borderRadius: 14 }}>View Open Roles <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
