import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, altText, altLink, altLabel }) => (
  <div className="auth-page">
    {/* Blobs */}
    <div className="hero-bg-blob blob-1" style={{ opacity: 0.3 }} />
    <div className="hero-bg-blob blob-2" style={{ opacity: 0.2 }} />

    {/* Logo */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ textAlign: 'center', marginBottom: '2rem' }}
    >
      <Link to="/" className="logo" style={{ justifyContent: 'center', display: 'inline-flex' }}>
        <div className="logo-icon">
          <Heart size={18} fill="white" color="white" />
        </div>
        <span className="logo-text font-display">Medi<span>Book</span></span>
      </Link>
    </motion.div>

    <motion.div
      className="auth-card glass-card"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <div className="auth-card-header">
        <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={11} /> AI-Powered Platform
        </span>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
      </div>
      {children}
      <p className="auth-alt">
        {altText}{' '}
        <Link to={altLink} className="auth-alt-link">{altLabel}</Link>
      </p>
    </motion.div>
  </div>
);

export default AuthLayout;
