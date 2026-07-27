import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import useForm from '../../hooks/useForm';
import AuthInput from './components/AuthInput';

const validate = (v) => {
  const e = {};
  if (!v.password) e.password = 'Password is required';
  else if (v.password.length < 8) e.password = 'Must be at least 8 characters';
  if (v.password !== v.confirm) e.confirm = 'Passwords do not match';
  return e;
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { password: '', confirm: '' },
    validate
  );

  const onSubmit = handleSubmit(async () => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  });

  return (
    <AuthLayout 
      title="Create New Password" 
      subtitle="Your new password must be different from previous used passwords."
      altText="Remember your password?" 
      altLink="/login" 
      altLabel="Sign in →"
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={28} color="white" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Password Reset!</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your password has been successfully reset. Redirecting you to login...
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column' }}>
            
            <AuthInput
              label="New Password"
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
              label="Confirm New Password"
              icon={Lock}
              name="confirm"
              type="password"
              value={values.confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter password"
              error={errors.confirm}
              touched={touched.confirm}
            />

            <motion.button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: 12, marginTop: '1rem' }}
              disabled={isSubmitting} whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
              {isSubmitting ? <><Loader2 size={18} className="spin" /> Resetting...</> : 'Reset Password'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
