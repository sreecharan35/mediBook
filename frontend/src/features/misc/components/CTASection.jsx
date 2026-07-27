import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, ArrowRight } from 'lucide-react';

const CTASection = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="cta-section" ref={ref} id="book">
      <div className="container">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 1rem',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 100,
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'white',
              marginBottom: '1.25rem',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            🚀 Get started today — it's free!
          </motion.span>

          <motion.h2
            className="cta-title"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
          >
            Ready to Transform Your Healthcare Experience?
          </motion.h2>

          <motion.p
            className="cta-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Join thousands of patients who trust MediBook for seamless, AI-powered healthcare appointments.
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
          >
            <motion.a
              href="#"
              className="btn btn-white"
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: 14 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Calendar size={18} />
              Book Appointment
            </motion.a>
            <motion.a
              href="#"
              className="btn btn-outline-white"
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: 14 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            style={{
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            {['✓ No Credit Card Required', '✓ HIPAA Compliant', '✓ 24/7 Support'].map((item) => (
              <span
                key={item}
                style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}
              >
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
