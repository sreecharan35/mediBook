import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';
import AuthInput from './components/AuthInput';
import SocialLogin from './components/SocialLogin';

const validate = (v) => {
  const e = {};
  if (!v.email?.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Invalid email address';
  if (!v.password) e.password = 'Password is required';
  return e;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [success, setSuccess] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '', remember: false },
    validate
  );

  const onSubmit = handleSubmit(async (data) => {
    setLoginError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Invalid credentials.');

      login(result.user, result.token, data.remember);
      setSuccess(true);
      const from = location.state?.from || '/dashboard';
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password.');
    }
  });

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to manage your appointments and health records" altText="Don't have an account?" altLink="/register" altLabel="Register now →">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0 1.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#10b981,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle size={28} color="white" />
            </div>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Logged in! Redirecting...</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column' }}>
            {loginError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '0.75rem 1rem', borderRadius: 10, background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {loginError}
              </motion.div>
            )}

            {/* Demo hint */}
            <div style={{ padding: '0.65rem 1rem', borderRadius: 10, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.18)', fontSize: '0.8rem', color: 'var(--brand-700)', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              <Sparkles size={13} style={{ flexShrink: 0 }} />
              Demo: <strong>patient@demo.com</strong> / <strong>demo1234</strong>
            </div>

            <AuthInput
              label="Email Address"
              icon={Mail}
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              error={errors.email}
              touched={touched.email}
            />

            <div style={{ position: 'relative' }}>
              <AuthInput
                label={
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span>Password</span>
                    <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--brand-600)', fontWeight: 600 }}>Forgot password?</Link>
                  </div>
                }
                icon={Lock}
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                error={errors.password}
                touched={touched.password}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input name="remember" id="remember" type="checkbox" checked={values.remember} onChange={handleChange} style={{ width: 15, height: 15, accentColor: 'var(--brand-600)' }} />
              <label htmlFor="remember" style={{ fontSize: '0.83rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Remember me for 7 days</label>
            </div>

            <motion.button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: 12 }}
              disabled={isSubmitting} whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
              {isSubmitting ? <><Loader2 size={18} className="spin" /> Signing in...</> : 'Sign In'}
            </motion.button>
            <SocialLogin />
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default LoginPage;
