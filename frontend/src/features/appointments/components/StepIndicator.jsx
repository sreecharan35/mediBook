import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * StepIndicator — animated 4-step progress tracker
 * Props: currentStep (0-3), steps: string[]
 */
const StepIndicator = ({ currentStep, steps }) => (
  <div className="step-indicator">
    {steps.map((label, i) => {
      const done = i < currentStep;
      const active = i === currentStep;
      return (
        <div key={label} className="step-indicator-item">
          {/* Connector line before */}
          {i > 0 && (
            <div
              className="step-connector"
              style={{ background: done ? 'var(--brand-500)' : 'var(--border-color)' }}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <motion.div
              className={`step-circle ${active ? 'step-active' : done ? 'step-done' : 'step-idle'}`}
              animate={{
                scale: active ? 1.15 : 1,
                boxShadow: active ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none',
              }}
              transition={{ duration: 0.3 }}
            >
              {done ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Check size={14} strokeWidth={3} />
                </motion.span>
              ) : (
                <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{i + 1}</span>
              )}
            </motion.div>
            <span
              className="step-label"
              style={{
                color: active ? 'var(--brand-600)' : done ? 'var(--brand-500)' : 'var(--text-muted)',
                fontWeight: active || done ? 700 : 500,
              }}
            >
              {label}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
