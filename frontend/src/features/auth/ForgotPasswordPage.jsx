import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Loader2, Send } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import useForm from '../../hooks/useForm';
import AuthInput from './components/AuthInput';

const validate = (v) => {
  const e = {};
  if (!v.email?.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Invalid email address';
  return e;
};

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '' },
    validate
  );

  const onSubmit = handleSubmit(async (data) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setSuccess(true);
  });

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email address and we'll send you a link to reset your password" 
      altText="Remember your password?" 
      altLink="/login" 
      altLabel="Sign in →"
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Send size={28} color="white" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Check your email</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              We've sent password reset instructions to <strong>{values.email}</strong>
            </p>
            <Link to="/login" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.75rem 2rem' }}>
              Return to Login
            </Link>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column' }}>
            
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

            <motion.button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: 12, marginTop: '1rem' }}
              disabled={isSubmitting} whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
              {isSubmitting ? <><Loader2 size={18} className="spin" /> Sending Link...</> : 'Send Reset Link'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
