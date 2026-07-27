import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Calendar, Cpu, FileText, Bell, Shield, HeartPulse, ArrowRight
} from 'lucide-react';
import { services } from '../../../data/doctors';

const iconMap = { Calendar, Bot: Cpu, FileText, Bell, Shield, HeartPulse };

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] },
  }),
};

const ServicesSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="services-section section-padding" id="services" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-blue">Our Services</span>
          <h2 className="section-title">
            Everything You Need for{' '}
            <span className="text-gradient">Smart Healthcare</span>
          </h2>
          <p>From AI-powered booking to digital records — we've built a complete healthcare ecosystem for you.</p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                className="glass-card service-card"
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                custom={i}
                whileHover={{ y: -6 }}
              >
                {/* Icon */}
                <div
                  className="service-icon-wrap"
                  style={{ background: `linear-gradient(135deg, ${getColors(service.color)})` }}
                >
                  {Icon && <Icon size={26} color="white" />}
                </div>

                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>

                <motion.div
                  className="service-arrow"
                  whileHover={{ x: 4 }}
                >
                  Learn more <ArrowRight size={14} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const getColors = (color) => {
  const colorMap = {
    blue: '#2563eb, #06b6d4',
    purple: '#7c3aed, #ec4899',
    green: '#059669, #0891b2',
    orange: '#ea580c, #d97706',
    teal: '#0d9488, #06b6d4',
    red: '#dc2626, #db2777',
  };
  return colorMap[color] || colorMap.blue;
};

export default ServicesSection;
