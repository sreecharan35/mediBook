import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldAlert, Check, Shield } from 'lucide-react';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { user: currentUser } = useAuth();
  const { searchQuery = '' } = useOutletContext() || {};

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      const updatedUser = await userService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updatedUser.role } : u));
      toast.success('User role updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={32} color="var(--brand-500)" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <ShieldAlert size={28} color="var(--brand-500)" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Manage Users
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Joined</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {searchQuery ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : users.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {u.name}
                    {u.id === currentUser?.id && (
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--brand-50)', color: 'var(--brand-600)', padding: '0.1rem 0.5rem', borderRadius: '1rem', marginLeft: '0.5rem' }}>
                        You
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={updating === u.id || (u.id === currentUser?.id && u.email === 'sreecharan8354@gmail.com')}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '0.5rem',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          cursor: (u.id === currentUser?.id && u.email === 'sreecharan8354@gmail.com') ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                      {updating === u.id && <Loader2 size={16} className="animate-spin" color="var(--brand-500)" />}
                    </div>
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

export default ManageUsersPage;
