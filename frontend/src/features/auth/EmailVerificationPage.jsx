import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    let timeout;
    if (token) {
      // Simulate verification API call
      timeout = setTimeout(() => {
        if (token === 'expired') {
          setStatus('error');
        } else {
          setStatus('success');
          setTimeout(() => navigate('/login'), 2500);
        }
      }, 2000);
    } else {
      setStatus('error');
    }
    return () => clearTimeout(timeout);
  }, [token, navigate]);

  return (
    <AuthLayout 
      title="Email Verification" 
      subtitle="We are verifying your email address..."
      altText="Want to use a different account?" 
      altLink="/register" 
      altLabel="Sign up →"
    >
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        {status === 'verifying' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={48} className="spin" style={{ color: 'var(--brand-500)', margin: '0 auto 1.5rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Verifying your secure token...</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Please do not close this page.</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: 24, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={36} color="white" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Email Verified!</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your account has been successfully verified. Redirecting you to login...
            </p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: 24, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <XCircle size={36} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Verification Failed</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              The verification link is invalid or has expired. Please request a new link.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.75rem 2rem' }}>
              Request New Link
            </Link>
          </motion.div>
        )}
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationPage;
