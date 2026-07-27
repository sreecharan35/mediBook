import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle, XCircle, 
  TrendingUp, Download, ArrowRight, User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { formatDate, formatTime } from '../../utils/appointmentUtils';
const StatCard = ({ title, value, trend, icon: Icon, color, delay }) => (
  <motion.div 
    className="dash-stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="stat-icon" style={{ background: `${color}15`, color }}>
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <h3>{title}</h3>
      <div className="stat-value">
        <span>{value}</span>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            <TrendingUp size={14} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'upcoming': 
    case 'pending':
    case 'confirmed': return <span className="apt-badge badge-blue">{status}</span>;
    case 'completed': return <span className="apt-badge badge-green">Completed</span>;
    case 'cancelled': return <span className="apt-badge badge-red">Cancelled</span>;
    default: return <span className="apt-badge">{status}</span>;
  }
};

const DashboardOverview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchApts = async () => {
      try {
        const data = await appointmentService.getPatientAppointments('b1000000-0000-0000-0000-000000000001'); // Demo Patient ID
        setRecentAppointments(data);
      } catch (err) {
        console.error('Failed to fetch dashboard appointments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApts();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-overview">
        {/* Skeleton Welcome */}
        <div className="skeleton skeleton-title" style={{ width: '30%', marginBottom: '0.5rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: '2rem' }} />
        
        {/* Skeleton Stats */}
        <div className="dash-stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="dash-stat-card skeleton-card">
              <div className="skeleton skeleton-avatar" style={{ width: 48, height: 48, marginBottom: '1rem' }} />
              <div className="skeleton skeleton-title" style={{ width: '60%', marginBottom: '0.5rem' }} />
              <div className="skeleton skeleton-title" style={{ width: '40%', height: '2rem' }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="dash-panel skeleton-card" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="welcome-section"
      >
        <h1 className="dash-title">Welcome back, {user?.name || 'Patient'} 👋</h1>
        <p className="dash-subtitle">Here is what's happening with your health schedule today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="dash-stats-grid">
        <StatCard title="Total Appointments" value={recentAppointments.length} color="#3b82f6" icon={Calendar} delay={0.1} />
        <StatCard title="Upcoming" value={recentAppointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length} color="#10b981" icon={Clock} delay={0.2} trend={12} />
        <StatCard title="Total Visits" value={recentAppointments.filter(a => a.status === 'Completed').length} color="#8b5cf6" icon={UserIcon} delay={0.3} trend={5} />
        <StatCard title="Cancelled" value={recentAppointments.filter(a => a.status === 'Cancelled').length} color="#ef4444" icon={XCircle} delay={0.4} />
      </div>

        {/* Quick Actions Panel */}
        <motion.div 
          className="dash-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="panel-header">
            <h2 className="panel-title">Quick Actions</h2>
          </div>
          <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <Link to="/book" className="quick-action-card primary">
              <div className="qa-icon"><Calendar size={24} /></div>
              <span>Book Appointment</span>
              <ArrowRight size={16} className="qa-arrow" />
            </Link>
            <Link to="/dashboard/appointments" className="quick-action-card secondary">
              <div className="qa-icon"><Clock size={24} /></div>
              <span>Reschedule</span>
              <ArrowRight size={16} className="qa-arrow" />
            </Link>
            <button className="quick-action-card outline">
              <div className="qa-icon"><Download size={24} /></div>
              <span>Download Records</span>
              <ArrowRight size={16} className="qa-arrow" />
            </button>
          </div>
        </motion.div>

      {/* Recent Appointments Table */}
      <motion.div 
        className="dash-panel" style={{ marginTop: '1.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="panel-header">
          <h2 className="panel-title">Recent Appointments</h2>
          <Link to="/dashboard/appointments" className="panel-link">View All</Link>
        </div>
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No recent appointments found.</td>
                </tr>
              ) : recentAppointments.slice(0, 5).map(apt => (
                <tr key={apt.id}>
                  <td style={{ fontWeight: 600 }}>{apt.appointment_id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{apt.doctors?.profiles?.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.doctors?.specialty}</div>
                  </td>
                  <td>
                    <div>{apt.appointment_date}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.time_slot}</div>
                  </td>
                  <td>{getStatusBadge(apt.status)}</td>
                  <td>
                    <Link to="/dashboard/appointments" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
