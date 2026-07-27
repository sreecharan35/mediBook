import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, CheckCircle, Stethoscope } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';
import AuthInput from './components/AuthInput';
import SocialLogin from './components/SocialLogin';

const validate = (v) => {
  const e = {};
  if (!v.name?.trim()) e.name = 'Full name is required';
  if (!v.email?.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Invalid email address';
  if (!v.password) e.password = 'Password is required';
  else if (v.password.length < 8) e.password = 'Must be at least 8 characters';
  if (v.password !== v.confirm) e.confirm = 'Passwords do not match';
  if (!v.agree) e.agree = 'You must accept the terms';
  return e;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setValue } = useForm(
    { name: '', email: '', phone: '', password: '', confirm: '', agree: false },
    validate
  );

  const [registerError, setRegisterError] = useState('');

  const onSubmit = handleSubmit(async (data) => {
    setRegisterError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, role })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Registration failed.');

      login(result.user, result.token, false);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setRegisterError(err.message || 'Registration failed.');
    }
  });

  return (
    <AuthLayout title="Create Your Account" subtitle="Join 50,000+ patients using MediBook for smarter healthcare" altText="Already have an account?" altLink="/login" altLabel="Sign in →">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0 1.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#10b981,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle size={28} color="white" />
            </div>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Account created! Redirecting...</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Role Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.25rem' }}>
              {[
                { value: 'patient', label: '🧑‍⚕️ Patient', desc: 'Book appointments' },
                { value: 'doctor', label: '👨‍⚕️ Doctor', desc: 'List your practice' },
              ].map(r => (
                <motion.button key={r.value} type="button" onClick={() => setRole(r.value)}
                  style={{
                    padding: '0.75rem', borderRadius: 12, border: '2px solid',
                    borderColor: role === r.value ? 'var(--brand-400)' : 'var(--border-color)',
                    background: role === r.value ? 'rgba(59,130,246,0.08)' : 'var(--bg-glass)',
                    cursor: 'pointer', textAlign: 'center',
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: role === r.value ? 'var(--brand-700)' : 'var(--text-secondary)' }}>{r.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                </motion.button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <AuthInput
                label="Full Name"
                icon={User}
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Dr. John Doe"
                error={errors.name}
                touched={touched.name}
              />
              <AuthInput
                label="Phone (optional)"
                icon={Phone}
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <AuthInput
                label="Password"
                icon={Lock}
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Min 8 characters"
                error={errors.password}
                touched={touched.password}
              />
              <AuthInput
                label="Confirm Password"
                name="confirm"
                type="password"
                value={values.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Re-enter password"
                error={errors.confirm}
                touched={touched.confirm}
              />
            </div>

            {/* Password strength */}
            {values.password && (
              <div style={{ display: 'flex', gap: '0.25rem', height: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, borderRadius: 2, background: values.password.length >= i * 3 ? (values.password.length >= 12 ? '#10b981' : values.password.length >= 8 ? '#f59e0b' : '#ef4444') : 'var(--border-color)', transition: 'background 0.3s' }} />
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <input name="agree" id="agree" type="checkbox" checked={values.agree} onChange={handleChange}
                style={{ width: 15, height: 15, marginTop: 2, accentColor: 'var(--brand-600)', flexShrink: 0 }} />
              <label htmlFor="agree" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, cursor: 'pointer' }}>
                I agree to the <a href="#" style={{ color: 'var(--brand-600)', fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--brand-600)', fontWeight: 600 }}>Privacy Policy</a>. HIPAA-compliant data handling guaranteed.
              </label>
            </div>
            {touched.agree && errors.agree && <span className="form-error" style={{ marginTop: '-0.5rem' }}>{errors.agree}</span>}

            <motion.button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: 12, marginTop: '1rem' }}
              disabled={isSubmitting} whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
              {isSubmitting ? <><Loader2 size={18} className="spin" /> Creating Account...</> : 'Create Account'}
            </motion.button>

            <SocialLogin />
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default RegisterPage;
