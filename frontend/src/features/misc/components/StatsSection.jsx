import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Stethoscope, Users, Building2, Star } from 'lucide-react';
import { stats } from '../../../data/doctors';

const iconMap = { Stethoscope, Users, Building2, Star };

// Custom hook to animate counting
const useCountUp = (end, duration = 2500, started = false) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, started]);

  return count;
};

const StatCard = ({ stat, index, inView }) => {
  const count = useCountUp(stat.value, 2500, inView);
  const Icon = iconMap[stat.icon];

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      {Icon && (
        <div className="stat-icon">
          <Icon size={26} color="white" />
        </div>
      )}
      <div className="stat-value">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  const { ref, inView } = useInView({ threshold: 0.25, triggerOnce: true });

  return (
    <section className="stats-section" ref={ref} id="about">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
