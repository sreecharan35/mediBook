import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import useForm from '../../hooks/useForm';

const validate = (v) => {
  const e = {};
  if (!v.name?.trim()) e.name = 'Name is required';
  if (!v.email?.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Invalid email address';
  if (!v.message?.trim()) e.message = 'Message is required';
  else if (v.message.length < 20) e.message = 'Message must be at least 20 characters';
  return e;
};

const offices = [
  { city: 'Hyderabad (HQ)', address: 'HITECH City, Madhapur, 500081', phone: '+91 40 1234 5678', hours: 'Mon–Fri, 9am–6pm IST', icon: '🇮🇳' },
  { city: 'Hyderabad (West)', address: 'Gachibowli, 500032', phone: '+91 40 9876 5432', hours: 'Mon–Fri, 9am–6pm IST', icon: '🇮🇳' },
  { city: 'Hyderabad (Central)', address: 'Banjara Hills, 500034', phone: '+91 40 2345 6789', hours: 'Mon–Fri, 9am–6pm IST', icon: '🇮🇳' },
];

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { name: '', email: '', subject: '', message: '' },
    validate
  );

  const onSubmit = handleSubmit(async (data) => {
    // Simulate API call — replace with: await notificationService.submitContact(data)
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
  });

  return (
    <div style={{ paddingTop: '72px', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--gradient-hero)', padding: '4rem 0 3rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Get in Touch</span>
            <h1 className="section-title">We'd Love to <span className="text-gradient">Hear From You</span></h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Have questions about MediBook? Our team typically responds within 2 hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left — Info */}
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Contact Information</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Reach out through any channel or fill in the form and we'll get back to you promptly.
              </p>

              {[
                { icon: Mail, label: 'Email', value: 'support@medibook.ai', color: '#3b82f6' },
                { icon: Phone, label: 'Phone', value: '+91 1800 123 4567', color: '#10b981' },
                { icon: Clock, label: 'Support Hours', value: '24/7 · Response < 2h', color: '#f59e0b' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
                  </div>
                </div>
              ))}

              {/* Offices */}
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', margin: '2rem 0 1rem' }}>Our Offices</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {offices.map(o => (
                  <motion.div key={o.city} className="glass-card" style={{ padding: '1rem 1.25rem' }} whileHover={{ y: -3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span>{o.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{o.city}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      <div><MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />{o.address}</div>
                      <div><Phone size={11} style={{ display: 'inline', marginRight: 4 }} />{o.phone}</div>
                      <div><Clock size={11} style={{ display: 'inline', marginRight: 4 }} />{o.hours}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '2rem 0' }}
                  >
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#10b981,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                      <CheckCircle size={36} color="white" />
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.5rem' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Thanks for reaching out. Our team will respond within 2 hours.</p>
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>Send Another</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={onSubmit} noValidate>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.75rem' }}>Send Us a Message</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="John Doe" className={`form-input ${touched.name && errors.name ? 'form-input-error' : ''}`} />
                        {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="john@example.com" className={`form-input ${touched.email && errors.email ? 'form-input-error' : ''}`} />
                        {touched.email && errors.email && <span className="form-error">{errors.email}</span>}
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Subject</label>
                      <input name="subject" value={values.subject} onChange={handleChange} placeholder="How can we help?" className="form-input" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Message *</label>
                      <textarea name="message" value={values.message} onChange={handleChange} onBlur={handleBlur} rows={5} placeholder="Tell us what you need..." className={`form-input ${touched.message && errors.message ? 'form-input-error' : ''}`} style={{ resize: 'vertical', minHeight: 120 }} />
                      {touched.message && errors.message && <span className="form-error">{errors.message}</span>}
                    </div>
                    <motion.button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }} disabled={isSubmitting} whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
                      {isSubmitting ? <><Loader2 size={18} className="spin" /> Sending...</> : <><Send size={18} /> Send Message</>}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
