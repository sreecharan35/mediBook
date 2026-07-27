import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Cpu, FileText, Bell, Shield, HeartPulse, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../../data/doctors';

const iconMap = { Calendar, Bot: Cpu, FileText, Bell, Shield, HeartPulse };
const gradients = {
  blue: '#2563eb, #06b6d4', purple: '#7c3aed, #ec4899',
  green: '#059669, #0891b2', orange: '#ea580c, #d97706',
  teal: '#0d9488, #06b6d4', red: '#dc2626, #db2777',
};

const pricingPlans = [
  {
    name: 'Basic', price: 'Free', color: 'var(--text-muted)', badge: null,
    features: ['5 appointments/month', 'Basic health records', 'Email notifications', 'Standard support'],
    cta: 'Get Started',
  },
  {
    name: 'Pro', price: '$19', period: '/mo', color: 'var(--brand-600)', badge: 'Most Popular',
    features: ['Unlimited appointments', 'Full health records', 'SMS & push notifications', '24/7 priority support', 'AI assistant access', 'Secure payments'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise', price: 'Custom', color: '#7c3aed', badge: 'For Teams',
    features: ['Everything in Pro', 'Multi-user dashboard', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee', 'HIPAA compliance kit'],
    cta: 'Contact Sales',
  },
];

const ServiceCard = ({ service, i }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const Icon = iconMap[service.icon];
  return (
    <motion.div
      ref={ref}
      className="glass-card service-card"
      id={service.id === 1 ? 'booking' : service.id === 2 ? 'ai' : service.id === 3 ? 'records' : service.id === 4 ? 'notify' : service.id === 5 ? 'payments' : 'support'}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      whileHover={{ y: -6 }}
      style={{ padding: '2.5rem' }}
    >
      <div className="service-icon-wrap" style={{ background: `linear-gradient(135deg, ${gradients[service.color]})`, width: 68, height: 68, borderRadius: 18 }}>
        {Icon && <Icon size={30} color="white" />}
      </div>
      <h3 className="service-title" style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>{service.title}</h3>
      <p className="service-desc" style={{ marginTop: '0.5rem', lineHeight: 1.75 }}>{service.description}</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {['Available 24/7', 'HIPAA Compliant', 'Instant Setup'].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={13} style={{ color: '#10b981' }} /> {f}
          </div>
        ))}
      </div>
      <Link to="/book" className="service-arrow" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        Get Started <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
};

const ServicesPage = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <div style={{ paddingTop: '72px', background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--gradient-hero)', padding: '4rem 0 3rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>What We Offer</span>
            <h1 className="section-title">
              Powerful Features for <span className="text-gradient">Modern Healthcare</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: 560, margin: '1rem auto 0', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Everything you need to manage your healthcare journey — from booking to billing — in one secure platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container" style={{ padding: '5rem 1.5rem' }} ref={ref}>
        <div className="services-grid">
          {services.map((s, i) => <ServiceCard key={s.id} service={s} i={i} />)}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ background: 'var(--bg-primary)', padding: '5rem 0' }}>
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <span className="badge badge-blue">Pricing</span>
            <h2 className="section-title">Simple, <span className="text-gradient">Transparent Pricing</span></h2>
            <p>No hidden fees. No surprises. Pick the plan that fits your needs.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className="glass-card"
                style={{ padding: '2rem', textAlign: 'center', position: 'relative', border: plan.name === 'Pro' ? '2px solid var(--brand-400)' : undefined }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-brand)', color: 'white', padding: '0.25rem 0.9rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{plan.name}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: plan.color, marginBottom: '0.25rem' }}>
                  {plan.price}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>
                <div style={{ height: 1, background: 'var(--border-color)', margin: '1.25rem 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', textAlign: 'left' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />{f}
                    </div>
                  ))}
                </div>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className={`btn ${plan.name === 'Pro' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
