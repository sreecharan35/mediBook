import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UserPlus, Search, CalendarCheck, HeartHandshake } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds. Set your health profile, insurance details, and preferences once — we handle the rest.',
    color: '#2563eb',
    bg: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    badge: '01',
  },
  {
    id: 2,
    icon: Search,
    title: 'Find the Right Doctor',
    description: 'Browse 1500+ verified specialists filtered by specialty, location, rating, and availability in real time.',
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    badge: '02',
  },
  {
    id: 3,
    icon: CalendarCheck,
    title: 'Book Instantly',
    description: 'Pick your preferred date and time slot. Our AI surfaces the best options and confirms instantly — no waiting.',
    color: '#059669',
    bg: 'linear-gradient(135deg, #059669, #06b6d4)',
    badge: '03',
  },
  {
    id: 4,
    icon: HeartHandshake,
    title: 'Get Expert Care',
    description: 'Attend your appointment in-person or via video. Manage follow-ups, prescriptions, and records all from your dashboard.',
    color: '#ea580c',
    bg: 'linear-gradient(135deg, #ea580c, #d97706)',
    badge: '04',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] },
  }),
};

const HowItWorksSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="how-section section-padding" id="how-it-works" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-blue">How It Works</span>
          <h2 className="section-title">
            Healthcare Made{' '}
            <span className="text-gradient">Effortlessly Simple</span>
          </h2>
          <p>Four easy steps to connect with the right doctor and take charge of your health.</p>
        </motion.div>

        {/* Steps grid */}
        <div className="how-grid">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                className="how-card glass-card"
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                custom={i}
                whileHover={{ y: -8 }}
              >
                {/* Step number badge */}
                <div className="how-badge">{step.badge}</div>

                {/* Icon */}
                <motion.div
                  className="how-icon-wrap"
                  style={{ background: step.bg }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon size={28} color="white" />
                </motion.div>

                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc">{step.description}</p>

                {/* Connector arrow (hidden on last) */}
                {i < steps.length - 1 && (
                  <div className="how-connector">
                    <motion.div
                      className="how-arrow"
                      animate={{ x: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    >
                      →
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom pill CTA */}
        <motion.div
          style={{ textAlign: 'center', marginTop: '3.5rem' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.a
            href="/register"
            className="btn btn-primary"
            style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started Free →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
