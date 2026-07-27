import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Search, Video, Phone, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingCalendar from './components/BookingCalendar';
import TimeSlotGrid from './components/TimeSlotGrid';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Formatting Utils ────────────────────────────────────────────────
const formatDate = (dateStr) => {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
};

const formatTime = (timeStr) => {
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(parseInt(h, 10), parseInt(m, 10));
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const getTypeIcon = (type) => {
  if (type === 'video') return <Video size={14} />;
  if (type === 'phone') return <Phone size={14} />;
  return <MapPin size={14} />;
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'upcoming': return <span className="apt-badge badge-blue"><Clock size={12} /> Upcoming</span>;
    case 'completed': return <span className="apt-badge badge-green"><CheckCircle size={12} /> Completed</span>;
    case 'cancelled': return <span className="apt-badge badge-red"><XCircle size={12} /> Cancelled</span>;
    default: return null;
  }
};

// ─── Component ───────────────────────────────────────────────────────
const MyAppointmentsPage = () => {
  const { user, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState('');
  const [cancelToast, setCancelToast] = useState(null);
  
  // Reschedule state
  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState('in-person');

  // Fetch real appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/appointments`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to fetch');
        }
        const data = await res.json();
        // Normalize backend data to match our card format
        const normalized = (data.appointments || []).map(a => ({
          id: a.confirmationCode || a._id,
          _id: a._id,
          doctorName: a.doctorName || 'Unknown Doctor',
          specialty: a.specialty || 'General',
          image: a.doctorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.doctorName || 'Doctor')}&background=6366f1&color=fff&size=128`,
          date: a.date,
          time: a.time,
          type: a.type || 'in-person',
          // Map backend statuses to display statuses
          status: a.status === 'confirmed' ? 'upcoming' : (a.status === 'rescheduled' ? 'upcoming' : a.status),
          location: a.type === 'video' ? 'Online Video Call' : a.type === 'phone' ? 'Phone Consultation' : 'Hyderabad, Telangana',
          reason: a.reason,
        }));
        setAppointments(normalized);
      } catch (err) {
        setFetchError('Could not load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);


  const filtered = appointments.filter(apt => {
    const matchStatus = 
      activeTab === 'all' ? true :
      activeTab === 'past' ? (apt.status === 'completed' || apt.status === 'cancelled') :
      apt.status === activeTab;
    
    const matchSearch = apt.doctorName.toLowerCase().includes(search.toLowerCase()) || 
                        apt.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCancel = async (id) => {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;
    if(window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.updateAppointmentStatus(apt._id, 'cancelled');
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
        setCancelToast(`Appointment ${id} has been cancelled.`);
        setTimeout(() => setCancelToast(null), 3000);
      } catch (error) {
        setCancelToast('Failed to cancel appointment.');
        setTimeout(() => setCancelToast(null), 3000);
      }
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!newDate || !newTime) return;
    try {
      await fetch(`${API_URL}/api/appointments/${rescheduleApt._id || rescheduleApt.id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {})
        },
        body: JSON.stringify({ date: newDate, time: newTime })
      });
      setAppointments(prev => prev.map(a => 
        a.id === rescheduleApt.id 
          ? { ...a, date: newDate, time: newTime, type: newType } 
          : a
      ));
      setCancelToast(`Appointment ${rescheduleApt.id} rescheduled to ${formatDate(newDate)} at ${formatTime(newTime)}.`);
      setTimeout(() => setCancelToast(null), 4000);
      setRescheduleApt(null);
    } catch (error) {
      setCancelToast('Failed to reschedule appointment.');
      setTimeout(() => setCancelToast(null), 3000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dash-title">Appointments</h1>
        <p className="dash-subtitle">Manage and view your healthcare schedule</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem', gap: '1rem', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="animate-spin" color="var(--brand-500)" />
          <span>Loading your appointments...</span>
        </div>
      )}

      {/* Error state */}
      {!loading && fetchError && (
        <div style={{ padding: '2rem', borderRadius: 12, background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', textAlign: 'center' }}>
          {fetchError}
        </div>
      )}

      {!loading && !fetchError && (
      <div style={{ paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border-color)', gap: '0.4rem' }}>
            {['upcoming', 'past', 'all'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s',
                  background: activeTab === tab ? 'var(--brand-500)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text-secondary)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by doctor or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px',
                border: '1px solid var(--border-color)', background: 'var(--bg-glass)', color: 'var(--text-primary)',
                outline: 'none', fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="apt-dashboard-card"
                >
                  {/* Card Header */}
                  <div className="apt-dash-header">
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{apt.id}</span>
                    {getStatusBadge(apt.status)}
                  </div>

                  {/* Card Body */}
                  <div className="apt-dash-body">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={apt.image} alt={apt.doctorName} style={{ width: 64, height: 64, borderRadius: '12px', objectFit: 'cover' }} />
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{apt.doctorName}</h3>
                        <p style={{ color: 'var(--brand-600)', fontSize: '0.85rem', fontWeight: 600 }}>{apt.specialty}</p>
                      </div>
                    </div>

                    <div className="apt-dash-details">
                      <div className="apt-dash-detail">
                        <div className="apt-dash-icon"><Calendar size={14} /></div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{formatDate(apt.date)}</div>
                        </div>
                      </div>
                      <div className="apt-dash-detail">
                        <div className="apt-dash-icon"><Clock size={14} /></div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{formatTime(apt.time)}</div>
                        </div>
                      </div>
                      <div className="apt-dash-detail">
                        <div className="apt-dash-icon">{getTypeIcon(apt.type)}</div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{apt.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="apt-dash-footer">
                    {apt.status === 'upcoming' && (
                      <>
                        <button onClick={() => handleCancel(apt.id)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Cancel</button>
                        <button onClick={() => {
                          setRescheduleApt(apt);
                          setNewDate(apt.date);
                          setNewTime(apt.time);
                          setNewType(apt.type);
                        }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.3rem' }}><RefreshCw size={13} /> Reschedule</button>
                      </>
                    )}
                    {(apt.status === 'completed' || apt.status === 'cancelled') && (
                      <Link to="/book" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.3rem' }}><Calendar size={13} /> Book Again</Link>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: 'center', padding: '3rem 2rem',
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  border: '1px dashed var(--border-color)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {/* Illustration */}
                <div style={{
                  width: 88, height: 88, borderRadius: '50%', margin: '0 auto 1.5rem',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(59,130,246,0.12))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Calendar size={40} color="var(--brand-500)" />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {activeTab === 'upcoming' ? 'No Upcoming Appointments' : activeTab === 'past' ? 'No Past Appointments' : 'No Appointments Yet'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  {activeTab === 'upcoming'
                    ? "You don't have any upcoming appointments scheduled."
                    : activeTab === 'past'
                    ? "You haven't had any appointments yet."
                    : "You haven't booked any appointments yet."}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>
                  Book with one of our top doctors in Hyderabad today — it takes less than 2 minutes!
                </p>

                <Link to="/book" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} /> Book an Appointment
                </Link>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  {[
                    { label: '50+ Specialists', desc: 'Across all departments' },
                    { label: 'Same Day Booking', desc: 'Instant confirmation' },
                    { label: 'Video & In-Person', desc: 'Choose what suits you' },
                  ].map(({ label, desc }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-500)' }}>{label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      )}

      {/* Cancel/Success Toast */}
      <AnimatePresence>
        {cancelToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}
          >
            <CheckCircle color="var(--brand-500)" size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cancelToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleApt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
            }}
            onClick={() => setRescheduleApt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--bg-primary)', borderRadius: '24px', width: '100%', maxWidth: '700px',
                maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Reschedule Appointment</h2>
                <button onClick={() => setRescheduleApt(null)} style={{ background: 'var(--bg-secondary)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <XCircle size={20} color="var(--text-muted)" />
                </button>
              </div>

              <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px' }}>
                  <img src={rescheduleApt.image} alt={rescheduleApt.doctorName} style={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{rescheduleApt.doctorName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{rescheduleApt.specialty}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">Select Date</label>
                    <BookingCalendar value={newDate} onChange={setNewDate} />
                  </div>
                  
                  {newDate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="form-label">Select Time</label>
                      <TimeSlotGrid date={newDate} value={newTime} onChange={setNewTime} />
                    </motion.div>
                  )}

                  <div>
                    <label className="form-label">Appointment Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                      {[
                        { id: 'in-person', icon: MapPin, label: 'In-Person' },
                        { id: 'video', icon: Video, label: 'Video Call' },
                        { id: 'phone', icon: Phone, label: 'Phone Call' }
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setNewType(type.id)}
                          style={{
                            padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                            border: `2px solid ${newType === type.id ? 'var(--brand-500)' : 'var(--border-color)'}`,
                            background: newType === type.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                            color: newType === type.id ? 'var(--brand-600)' : 'var(--text-secondary)'
                          }}
                        >
                          <type.icon size={20} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', position: 'sticky', bottom: 0 }}>
                <button type="button" onClick={() => setRescheduleApt(null)} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>Cancel</button>
                <button type="button" onClick={handleRescheduleSubmit} disabled={!newDate || !newTime} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Confirm Reschedule</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyAppointmentsPage;
