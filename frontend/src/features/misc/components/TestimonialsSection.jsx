import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../../data/doctors';

const TestimonialCard = ({ testimonial, index }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      className="glass-card testimonial-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Quote icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
          ))}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--brand-500), var(--accent-500))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.15,
        }}>
          <Quote size={20} color="white" />
        </div>
      </div>

      <p className="testimonial-text">"{testimonial.text}"</p>

      <div className="testimonial-author">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="testimonial-avatar"
        />
        <div>
          <div className="testimonial-name">{testimonial.name}</div>
          <div className="testimonial-role">{testimonial.role}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>✓</div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section className="testimonials-section section-padding" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-blue">Patient Stories</span>
          <h2 className="section-title">
            What Our{' '}
            <span className="text-gradient">Patients Say</span>
          </h2>
          <p>Real experiences from patients who transformed their healthcare journey with MediBook.</p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
