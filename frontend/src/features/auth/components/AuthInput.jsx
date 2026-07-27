import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = ({ label, icon: Icon, type = 'text', error, touched, name, value, onChange, onBlur, placeholder, ...props }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const displayType = isPassword ? (showPwd ? 'text' : 'password') : type;
  const hasError = touched && error;

  return (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {Icon && <Icon size={14} style={{ opacity: 0.7 }} />}
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          name={name}
          type={displayType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`form-input ${hasError ? 'form-input-error' : ''}`}
          style={{ 
            width: '100%', 
            padding: '0.85rem 1rem', 
            borderRadius: '10px', 
            border: `1px solid ${hasError ? 'var(--brand-error)' : 'var(--border-color)'}`,
            background: 'var(--bg-glass)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            paddingRight: isPassword ? '2.75rem' : '1rem'
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            style={{ 
              position: 'absolute', 
              right: '0.85rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              background: 'none', 
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hasError && (
        <span className="form-error" style={{ display: 'block', color: 'var(--brand-error)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default AuthInput;
