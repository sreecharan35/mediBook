import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CalendarDays, Users, FileText, 
  Settings, LogOut, Menu, X, Bell, Moon, Sun, 
  Search, User, ChevronRight, Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { path: '/dashboard/profile', label: 'My Profile', icon: User },
  { path: '/dashboard/doctors', label: 'Doctors', icon: Users },
  { path: '/dashboard/admin/add-doctor', label: 'Add Doctor (Admin)', icon: Users },
  { path: '/dashboard/admin/users', label: 'Manage Users (Admin)', icon: Users },
  { path: '/dashboard/records', label: 'Medical Records', icon: FileText },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderNavLinks = () => (
    <nav className="dash-nav">
      {NAV_ITEMS.map((item) => {
        // Skip admin routes if user is not admin
        if (item.path.includes('/admin/') && user?.role !== 'admin') {
          return null;
        }

        const isActive = item.exact 
          ? location.pathname === item.path 
          : location.pathname.startsWith(item.path);
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`dash-nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {isActive && (
              <motion.div 
                layoutId="dashNavIndicator" 
                className="dash-nav-indicator"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );

  // Link wrapper to prevent React Router warning about NavLink props
  const Link = ({ to, children, className }) => (
    <NavLink 
      to={to} 
      end={to === '/dashboard'}
      className={({ isActive }) => `${className} ${isActive ? 'active' : ''}`}
    >
      {children}
    </NavLink>
  );

  return (
    <div className="dash-layout">
      {/* Desktop Sidebar */}
      <aside className="dash-sidebar hide-on-mobile">
        <div className="dash-sidebar-header">
          <NavLink to="/" className="dash-logo">
            <div className="dash-logo-icon">
              <Stethoscope size={20} color="white" />
            </div>
            <span>MediBook</span>
          </NavLink>
        </div>
        
        <div className="dash-sidebar-content">
          {renderNavLinks()}
        </div>
        
        <div className="dash-sidebar-footer">
          <button onClick={handleLogout} className="dash-nav-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="dash-mobile-header hide-on-desktop">
        <button className="icon-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <NavLink to="/" className="dash-logo">
          <div className="dash-logo-icon" style={{ width: 32, height: 32 }}>
            <Stethoscope size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.2rem' }}>MediBook</span>
        </NavLink>
        <div className="dash-mobile-actions">
          <button className="icon-btn" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="dash-mobile-overlay hide-on-desktop"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="dash-sidebar mobile-sidebar hide-on-desktop"
            >
              <div className="dash-sidebar-header" style={{ justifyContent: 'space-between' }}>
                <NavLink to="/" className="dash-logo">
                  <div className="dash-logo-icon">
                    <Stethoscope size={20} color="white" />
                  </div>
                  <span>MediBook</span>
                </NavLink>
                <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="dash-sidebar-content">
                {renderNavLinks()}
              </div>
              <div className="dash-sidebar-footer">
                <button onClick={handleLogout} className="dash-nav-link logout-btn">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="dash-main">
        {/* Top Header */}
        <header className="dash-top-header hide-on-mobile">
          {location.pathname.includes('/doctors') || location.pathname.includes('/add-doctor') ? (
            <div className="dash-header-search">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search doctors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </div>
          ) : (
            <div></div> // Empty div to preserve flex layout if needed
          )}
          
          <div className="dash-header-actions">
            <button className="icon-btn" onClick={toggleTheme}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-btn notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            <div className="dash-user-profile" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
              <div className="user-avatar">
                {user?.picture
                  ? <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : (user?.name?.charAt(0) || <User size={18} />)
                }
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Patient'}</span>
                <span className="user-role">{user?.role || 'patient'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="dash-content-wrapper">
          <Outlet context={{ searchQuery }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
