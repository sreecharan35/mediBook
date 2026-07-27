import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Globe, MessageSquare, Send, AtSign } from 'lucide-react';

const footerLinks = {
  Company: ['About Us', 'Our Team', 'Careers', 'Press', 'Blog'],
  Services: ['Online Booking', 'AI Assistant', 'Health Records', 'Payments', 'Support'],
  Doctors: ['Find Specialists', 'Top Rated', 'By Location', 'Emergency', 'Consultation'],
};

const socialLinks = [
  { icon: Globe, label: 'Website' },
  { icon: MessageSquare, label: 'Community' },
  { icon: Send, label: 'Telegram' },
  { icon: AtSign, label: 'Email' },
];

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <motion.div
            className="logo"
            whileHover={{ scale: 1.02 }}
          >
            <div className="logo-icon">
              <Heart size={16} fill="white" color="white" />
            </div>
            <span className="logo-text font-display">
              Medi<span>Book</span>
            </span>
          </motion.div>
          <p>
            AI-powered healthcare scheduling platform connecting patients with verified doctors. Book appointments anytime, anywhere.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
              <Mail size={14} /> support@medibook.ai
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
              <Phone size={14} /> +91 1800 123 4567
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
              <MapPin size={14} /> HITECH City, Hyderabad 500081
            </div>
          </div>
          <div className="footer-social">
            {socialLinks.map(({ icon: Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                className="social-btn"
                aria-label={label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Link groups */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="footer-col">
            <h4>{category}</h4>
            <ul className="footer-links">
              {links.map((link) => (
                <li key={link}>
                  <motion.a href="#" whileHover={{ x: 3 }}>
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <span>© 2025 MediBook. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
            <motion.a key={item} href="#" whileHover={{ color: 'var(--brand-600)' }} style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
              {item}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
