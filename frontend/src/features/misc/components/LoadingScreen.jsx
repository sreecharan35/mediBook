import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2000);
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 20, 100));
    }, 100);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            marginBottom: '0.5rem',
          }}
        >
          <Heart size={40} color="white" fill="white" />
        </motion.div>

        <motion.div
          className="loading-logo"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Medi<span style={{ color: 'rgba(255,255,255,0.7)' }}>Book</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
          style={{ color: 'white', fontSize: '0.9rem' }}
        >
          Your AI-Powered Health Companion
        </motion.p>

        <div className="loading-bar">
          <motion.div
            style={{
              height: '100%',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 4,
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
