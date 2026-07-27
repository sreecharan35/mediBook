import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

/**
 * FormField — universal form field component
 * Supports: text, email, tel, number, select, radio, textarea
 *
 * Props:
 *   name        — RHF field name
 *   label       — Label text
 *   type        — 'text' | 'email' | 'tel' | 'number' | 'select' | 'radio' | 'textarea'
 *   placeholder — placeholder string
 *   options     — [{ value, label }] for select/radio
 *   icon        — Lucide icon component (optional)
 *   hint        — helper text below input
 *   required    — show asterisk
 *   ...rest     — forwarded to input/select/textarea
 */
const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  options = [],
  icon: Icon,
  hint,
  required,
  ...rest
}) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div className="booking-form-group">
      {label && (
        <label className="booking-label" htmlFor={name}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
        </label>
      )}

      {/* ── Textarea ── */}
      {type === 'textarea' && (
        <div className="booking-input-wrap">
          <textarea
            id={name}
            placeholder={placeholder}
            className={`booking-input booking-textarea ${error ? 'input-error' : ''}`}
            {...register(name)}
            {...rest}
          />
        </div>
      )}

      {/* ── Select ── */}
      {type === 'select' && (
        <div className="booking-input-wrap">
          {Icon && <div className="booking-input-icon"><Icon size={16} /></div>}
          <select
            id={name}
            className={`booking-input ${Icon ? 'has-icon' : ''} ${error ? 'input-error' : ''}`}
            {...register(name)}
            {...rest}
          >
            <option value="">{placeholder || 'Select…'}</option>
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Radio group ── */}
      {type === 'radio' && (
        <div className="radio-group">
          {options.map(o => (
            <label key={o.value} className="radio-option">
              <input
                type="radio"
                value={o.value}
                className="radio-input"
                {...register(name)}
              />
              {o.icon && <span className="radio-emoji">{o.icon}</span>}
              <span className="radio-label">{o.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* ── Text / Email / Tel / Number ── */}
      {!['textarea', 'select', 'radio'].includes(type) && (
        <div className="booking-input-wrap">
          {Icon && <div className="booking-input-icon"><Icon size={16} /></div>}
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className={`booking-input ${Icon ? 'has-icon' : ''} ${error ? 'input-error' : ''}`}
            {...register(name)}
            {...rest}
          />
        </div>
      )}

      {/* ── Hint ── */}
      {hint && !error && (
        <p className="booking-hint">{hint}</p>
      )}

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="booking-field-error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField;
