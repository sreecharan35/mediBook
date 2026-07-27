import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Loader2 } from 'lucide-react';

import LoadingScreen from './features/misc/components/LoadingScreen';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Global Styles
import './index.css';

// Core Components
import ProtectedRoute from './features/auth/components/ProtectedRoute';

// Lazy Loaded Pages
const Home = lazy(() => import('./features/misc/Home'));
const DoctorsPage = lazy(() => import('./features/doctors/DoctorsPage'));
const ServicesPage = lazy(() => import('./features/misc/ServicesPage'));
const AboutPage = lazy(() => import('./features/misc/AboutPage'));
const ContactPage = lazy(() => import('./features/misc/ContactPage'));
const AskAIPage = lazy(() => import('./features/misc/AskAIPage'));
const BookPage = lazy(() => import('./features/appointments/BookPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./features/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./features/auth/ResetPasswordPage'));
const EmailVerificationPage = lazy(() => import('./features/auth/EmailVerificationPage'));
const MyAppointmentsPage = lazy(() => import('./features/appointments/MyAppointmentsPage'));
const DashboardOverview = lazy(() => import('./features/dashboard/DashboardOverview'));
const AddDoctorPage = lazy(() => import('./features/admin/AddDoctorPage'));
const ProfilePage = lazy(() => import('./features/dashboard/ProfilePage'));
const ManageUsersPage = lazy(() => import('./features/admin/ManageUsersPage'));

// Suspense Fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
    <Loader2 className="animate-spin" size={32} color="var(--primary)" />
  </div>
);

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
      ) : (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public pages with Navbar + Footer */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/ask-ai" element={<ProtectedRoute><AskAIPage /></ProtectedRoute>} />
                <Route path="/book" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
                {/* Legacy redirect for old appointments route */}
                <Route path="/appointments" element={<Navigate to="/dashboard/appointments" replace />} />
              </Route>

              {/* Dashboard Layout Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="appointments" element={<MyAppointmentsPage />} />
                {/* Admin Routes */}
                <Route path="profile" element={<ProfilePage />} />
                <Route path="admin/add-doctor" element={<ProtectedRoute allowedRoles={['admin']}><AddDoctorPage /></ProtectedRoute>} />
                <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsersPage /></ProtectedRoute>} />
                {/* Placeholders for future pages */}
                <Route path="doctors" element={<div style={{padding:'2rem'}}><h2>Doctors Directory</h2><p>Coming Soon...</p></div>} />
                <Route path="records" element={<div style={{padding:'2rem'}}><h2>Medical Records</h2><p>Coming Soon...</p></div>} />
                <Route path="settings" element={<div style={{padding:'2rem'}}><h2>Settings</h2><p>Coming Soon...</p></div>} />
              </Route>

              {/* Auth pages — standalone layout (no Navbar/Footer) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--bg-primary)', textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--brand-500)', lineHeight: 1 }}>404</div>
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>Page Not Found</h1>
                  <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>Back to Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
          <BackToTop />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
