import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, User, Stethoscope, Copy, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../../../utils/appointmentUtils';

/**
 * BookingSuccess — animated success screen with confetti & APT ID
 * Props:
 *   appointmentId  — string (e.g. "APT-2026-0001")
 *   data           — full form data
 */
const BookingSuccess = ({ appointmentId, data }) => {
  const canvasRef = useRef(null);

  // Simple confetti animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#2563eb','#06b6d4','#10b981','#f59e0b','#8b5cf6','#ec4899'];
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      opacity: 1,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 8,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 2);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.vy += 0.05;
        p.opacity -= 0.008;
      });
      if (pieces.some(p => p.opacity > 0)) animId = requestAnimationFrame(draw);
    };
    const timer = setTimeout(() => { animId = requestAnimationFrame(draw); }, 200);
    return () => { clearTimeout(timer); cancelAnimationFrame(animId); };
  }, []);

  const copyId = () => {
    navigator.clipboard.writeText(appointmentId).catch(() => {});
  };

  const details = [
    { icon: User, label: 'Patient', value: data.name },
    { icon: Stethoscope, label: 'Doctor', value: data.doctorName },
    { icon: Calendar, label: 'Date', value: formatDate(data.date) },
    { icon: Clock, label: 'Time', value: formatTime(data.time) },
  ];

  return (
    <div className="booking-success-wrap">
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="confetti-canvas" />

      {/* Check circle */}
      <motion.div
        className="success-icon-wrap"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
      >
        <motion.div
          className="success-ring"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.3 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        <CheckCircle size={52} color="white" />
      </motion.div>

      <motion.h2
        className="success-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Appointment Confirmed! 🎉
      </motion.h2>

      <motion.p
        className="success-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        A confirmation has been sent to <strong>{data.email}</strong>
      </motion.p>

      {/* Appointment ID card */}
      <motion.div
        className="apt-id-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <div className="apt-id-label">Appointment ID</div>
        <div className="apt-id-value">{appointmentId}</div>
        <button type="button" onClick={copyId} className="apt-copy-btn" title="Copy ID">
          <Copy size={14} /> Copy
        </button>
      </motion.div>

      {/* Summary */}
      <motion.div
        className="success-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="success-detail-row">
            <div className="success-detail-icon"><Icon size={14} /></div>
            <span className="success-detail-label">{label}</span>
            <span className="success-detail-value">{value}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        style={{ marginTop: '1.5rem', textAlign: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span className="badge badge-green" style={{ display: 'inline-flex', gap: '0.4rem', padding: '0.4rem 0.8rem' }}>
          <CheckCircle size={13} /> Automation workflows triggered
        </span>
      </motion.div>

      <motion.div
        style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        <Link to="/" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', gap: '0.4rem' }}>
          <Home size={15} /> Home
        </Link>
        <Link to="/book" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          Book Another
        </Link>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
