import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Heart, Menu, X, Calendar, ChevronDown,
  Stethoscope, Users, Star, Zap, FileText, Bell, Shield,
  HeartPulse, CreditCard, Target, Info, Briefcase, Clock,
  MapPin, Phone, Bot, Sparkles
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

const navConfig = [
  { label: 'Home', to: '/', exact: true },
  {
    label: 'Doctors',
    to: '/doctors',
    dropdown: [
      { label: 'Find Specialists', to: '/doctors', icon: Stethoscope, desc: 'Browse verified specialists' },
      { label: 'Top Rated', to: '/doctors?filter=top', icon: Star, desc: 'Highest patient ratings' },
      { label: 'Available Now', to: '/doctors?filter=available', icon: Clock, desc: 'Book same-day appointments' },
      { label: 'By Location', to: '/doctors?filter=location', icon: MapPin, desc: 'Find doctors near you' },
    ],
  },
  {
    label: 'Services',
    to: '/services',
    dropdown: [
      { label: 'Online Booking', to: '/services#booking', icon: Calendar, desc: 'Schedule appointments 24/7' },
      { label: 'AI Assistant', to: '/services#ai', icon: Bot, desc: 'Smart health recommendations' },
      { label: 'Health Records', to: '/services#records', icon: FileText, desc: 'Secure digital records' },
      { label: 'Notifications', to: '/services#notify', icon: Bell, desc: 'Real-time reminders' },
      { label: 'Secure Payments', to: '/services#payments', icon: Shield, desc: 'Encrypted transactions' },
      { label: '24/7 Support', to: '/services#support', icon: HeartPulse, desc: 'Always here for you' },
    ],
  },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Ask AI', to: '/ask-ai' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.15 } },
};

const NavDropdown = ({ item, onClose }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const location = useLocation();

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');

  return (
    <li ref={ref} style={{ position: 'relative' }}>
      <button
        className={`nav-link nav-link-dropdown ${isActive ? 'nav-link-active' : ''}`}
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="nav-dropdown-inner">
              {item.dropdown.map((sub) => (
                <Link
                  key={sub.label}
                  to={sub.to}
                  className="nav-dropdown-item"
                  onClick={() => { setOpen(false); onClose?.(); }}
                >
                  <div className="nav-dropdown-icon">
                    <sub.icon size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-label">{sub.label}</div>
                    <div className="nav-dropdown-desc">{sub.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true); // Scrolling down
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false); // Scrolling up
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); }, [location.pathname]);

  return (
    <motion.header
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="logo-icon">
                  <Heart size={18} fill="white" color="white" />
                </div>
                <span className="logo-text font-display">Medi<span>Book</span></span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation">
            <ul className="nav-links">
              {navConfig.map((item) =>
                item.dropdown ? (
                  <NavDropdown key={item.label} item={item} />
                ) : (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <motion.button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost" style={{ fontSize: '0.87rem' }}>Dashboard</Link>
                <button onClick={logout} className="btn btn-outline" style={{ fontSize: '0.87rem', padding: '0.55rem 1.1rem', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.87rem' }}>Login</Link>
                <Link to="/register" className="btn btn-outline" style={{ fontSize: '0.87rem', padding: '0.55rem 1.1rem' }}>Register</Link>
              </>
            )}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/book" className="btn btn-primary" style={{ fontSize: '0.87rem', padding: '0.6rem 1.25rem' }}>
                <Calendar size={15} /> Book Now
              </Link>
            </motion.div>

            {/* Mobile toggle */}
            <motion.button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navConfig.map((item, i) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div>
                    <button
                      className="mobile-nav-parent"
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    >
                      <span>{item.label}</span>
                      <motion.span animate={{ rotate: mobileExpanded === item.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {mobileExpanded === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mobile-dropdown"
                        >
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.to}
                              className="mobile-sub-link"
                              onClick={() => setMobileOpen(false)}
                            >
                              <sub.icon size={14} style={{ color: 'var(--brand-500)' }} />
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                    style={{ display: 'block' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.87rem' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.87rem', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.87rem' }} onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.87rem' }} onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
