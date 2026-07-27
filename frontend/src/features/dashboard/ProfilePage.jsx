import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Shield, Edit3, Save,
  X, Camera, Calendar, CheckCircle, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const ProfilePage = () => {
  const { user, login, getToken } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aptStats, setAptStats] = useState({ total: 0, upcoming: 0, completed: 0 });

  // Fetch real appointment counts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/appointments`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) return;
        const data = await res.json();
        const apts = data.appointments || [];
        setAptStats({
          total: apts.length,
          upcoming: apts.filter(a => a.status === 'confirmed' || a.status === 'rescheduled').length,
          completed: apts.filter(a => a.status === 'completed').length,
        });
      } catch (_) {}
    };
    fetchStats();
  }, []);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || 'Hyderabad, Telangana',
    bio: user?.bio || 'Patient at MediBook. Managing my health appointments digitally.',
    dob: user?.dob || '',
    gender: user?.gender || '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    // Save updated user info back to auth context
    login({ ...user, ...form }, true);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || 'Hyderabad, Telangana',
      bio: user?.bio || 'Patient at MediBook. Managing my health appointments digitally.',
      dob: user?.dob || '',
      gender: user?.gender || '',
    });
    setEditing(false);
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleColor = user?.role === 'admin' ? '#f59e0b' : '#6366f1';
  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Patient';

  return (
    <div style={{ padding: '2rem', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <motion.div {...fadeUp} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          My Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
          Manage your personal information and account settings
        </p>
      </motion.div>

      {/* Success toast */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <CheckCircle size={18} /> Profile updated successfully!
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        {...fadeUp}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '1.5rem'
        }}
      >
        {/* Cover banner */}
        <div style={{
          height: 120,
          background: 'linear-gradient(135deg, var(--brand-500) 0%, #6366f1 100%)',
          position: 'relative'
        }} />

        {/* Avatar + Basic Info row */}
        <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginTop: -48 }}>
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                style={{ width: 96, height: 96, borderRadius: '50%', border: '4px solid var(--bg-card)', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: 96, height: 96, borderRadius: '50%', border: '4px solid var(--bg-card)',
                background: 'linear-gradient(135deg, var(--brand-500), #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: 'white',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                {initials}
              </div>
            )}
            {editing && (
              <button style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--brand-500)', border: '2px solid var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white'
              }}>
                <Camera size={12} />
              </button>
            )}
          </div>

          {/* Edit / Save buttons */}
          <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            {editing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={handleCancel}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  <X size={15} /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={handleSave}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', borderRadius: 10, border: 'none', background: 'var(--brand-500)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  <Save size={15} /> Save Changes
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setEditing(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
              >
                <Edit3 size={15} /> Edit Profile
              </motion.button>
            )}
          </div>

          {/* Name & role */}
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {user?.name || 'User'}
              </h2>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.25rem 0.75rem', borderRadius: 20,
                background: `${roleColor}20`, color: roleColor,
                fontSize: '0.78rem', fontWeight: 700
              }}>
                <Shield size={12} /> {roleLabel}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              {user?.email}
            </p>
          </div>

          {/* Bio */}
          <div style={{ marginTop: '1rem' }}>
            {editing ? (
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={2}
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
                  border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'vertical',
                  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
                }}
              />
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {form.bio}
              </p>
            )}
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { icon: Calendar, label: 'Total Bookings', value: aptStats.total },
              { icon: Clock, label: 'Upcoming', value: aptStats.upcoming },
              { icon: CheckCircle, label: 'Completed', value: aptStats.completed },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={16} color="var(--brand-500)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Personal Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            { label: 'Full Name', name: 'name', icon: User, type: 'text' },
            { label: 'Email Address', name: 'email', icon: Mail, type: 'email', disabled: user?.authProvider === 'google' },
            { label: 'Phone Number', name: 'phone', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
            { label: 'Location', name: 'location', icon: MapPin, type: 'text' },
            { label: 'Date of Birth', name: 'dob', icon: Calendar, type: 'date' },
          ].map(({ label, name, icon: Icon, type, disabled, placeholder }) => (
            <div key={name}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <Icon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  disabled={!editing || disabled}
                  placeholder={placeholder || ''}
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                    borderRadius: 10,
                    border: `1px solid ${editing && !disabled ? 'var(--brand-500)' : 'var(--border-color)'}`,
                    background: editing && !disabled ? 'var(--bg-secondary)' : 'transparent',
                    color: 'var(--text-primary)', fontSize: '0.92rem',
                    outline: 'none', boxSizing: 'border-box',
                    cursor: editing && !disabled ? 'text' : 'default',
                    opacity: disabled ? 0.6 : 1,
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>
              {disabled && editing && (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Email cannot be changed for Google accounts.
                </p>
              )}
            </div>
          ))}

          {/* Gender select */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Gender
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={!editing}
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
                  borderRadius: 10,
                  border: `1px solid ${editing ? 'var(--brand-500)' : 'var(--border-color)'}`,
                  background: editing ? 'var(--bg-secondary)' : 'transparent',
                  color: 'var(--text-primary)', fontSize: '0.92rem',
                  outline: 'none', boxSizing: 'border-box',
                  cursor: editing ? 'pointer' : 'default',
                  fontFamily: 'Inter, sans-serif',
                  appearance: 'none',
                }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
