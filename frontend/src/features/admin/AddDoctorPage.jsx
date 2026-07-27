import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Activity, MapPin, Clock, Star, DollarSign, Image as ImageIcon, CheckCircle, Award, Loader2, Trash2, Edit2 } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import toast from 'react-hot-toast';

const AddDoctorPage = () => {
  const navigate = useNavigate();
  const { searchQuery = '' } = useOutletContext() || {};
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'add'
  const [editingId, setEditingId] = useState(null);

  const fetchDoctors = async () => {
    setFetchingDoctors(true);
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data || []);
    } catch (err) {
      toast.error('Failed to load doctors');
    } finally {
      setFetchingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;
    try {
      await doctorService.deleteDoctor(id);
      toast.success('Doctor removed successfully');
      setDoctors(doctors.filter(d => d.id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to remove doctor');
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Cardiologist',
    hospital: '',
    experience: 0,
    rating: 5.0,
    reviews: 0,
    fee: 0,
    badge: 'New',
    availability: 'Mon - Fri',
    languages: 'English',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name || '',
      specialty: doctor.specialty || 'Cardiologist',
      hospital: doctor.hospital || '',
      experience: doctor.experience || 0,
      rating: doctor.rating || 5.0,
      reviews: doctor.reviews || 0,
      fee: doctor.fee || 0,
      badge: doctor.badge || '',
      availability: doctor.availability || '',
      languages: Array.isArray(doctor.languages) ? doctor.languages.join(', ') : (doctor.languages || 'English'),
      image: doctor.image || ''
    });
    setEditingId(doctor.id);
    setActiveTab('add');
  };

  const resetForm = () => {
    setFormData({
      name: '', specialty: 'Cardiologist', hospital: '', experience: 0, rating: 5.0,
      reviews: 0, fee: 0, badge: 'New', availability: 'Mon - Fri', languages: 'English',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300'
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const langs = formData.languages.split(',').map(l => l.trim()).filter(l => l);

      const newDoctor = {
        ...formData,
        languages: langs.length > 0 ? langs : ['English'],
        experience: parseInt(formData.experience),
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        fee: parseInt(formData.fee),
      };

      if (editingId) {
        await doctorService.updateDoctor(editingId, newDoctor);
        toast.success('Doctor updated successfully!');
      } else {
        await doctorService.addDoctor(newDoctor);
        toast.success('Doctor added successfully!');
      }

      setActiveTab('manage');
      fetchDoctors();
      resetForm();
    } catch (err) {
      toast.error(err.message || (editingId ? 'Failed to update doctor' : 'Failed to add doctor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '2.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Manage Doctors
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { setActiveTab('manage'); resetForm(); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', background: activeTab === 'manage' ? 'var(--brand-500)' : 'transparent', color: activeTab === 'manage' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            >
              List Doctors
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('add'); if (!editingId) resetForm(); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', background: activeTab === 'add' ? 'var(--brand-500)' : 'transparent', color: activeTab === 'add' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            >
              {editingId ? 'Edit Doctor' : 'Add Doctor'}
            </button>
          </div>
        </div>

        {activeTab === 'manage' && (
          <div>
            {fetchingDoctors ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 className="spin" size={32} color="var(--brand-500)" />
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                {searchQuery ? 'No doctors match your search.' : 'No doctors found.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredDoctors.map(doctor => (
                  <div key={doctor.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={doctor.image} alt={doctor.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{doctor.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{doctor.specialty} • {doctor.hospital}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(doctor)}
                        className="btn"
                        style={{ padding: '0.5rem', background: '#dbeafe', color: '#3b82f6', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', cursor: 'pointer' }}
                        title="Edit Doctor"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doctor.id)}
                        className="btn"
                        style={{ padding: '0.5rem', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', cursor: 'pointer' }}
                        title="Remove Doctor"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

              {/* Name */}
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Dr. Rajesh Sharma"
                    required
                  />
                </div>
              </div>

              {/* Specialty */}
              <div className="input-group">
                <label>Specialty</label>
                <div className="input-wrapper">
                  <Activity size={18} />
                  <select name="specialty" value={formData.specialty} onChange={handleChange}>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="General Physician">General Physician</option>
                  </select>
                </div>
              </div>

              {/* Hospital */}
              <div className="input-group">
                <label>Hospital</label>
                <div className="input-wrapper">
                  <MapPin size={18} />
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    placeholder="e.g., Apollo Hospitals"
                    required
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="input-group">
                <label>Experience (Years)</label>
                <div className="input-wrapper">
                  <Clock size={18} />
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Fee */}
              <div className="input-group">
                <label>Consultation Fee</label>
                <div className="input-wrapper">
                  <DollarSign size={18} />
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="input-group">
                <label>Initial Rating</label>
                <div className="input-wrapper">
                  <Star size={18} />
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                    required
                  />
                </div>
              </div>

              {/* Reviews Count */}
              <div className="input-group">
                <label>Initial Reviews Count</label>
                <div className="input-wrapper">
                  <CheckCircle size={18} />
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="input-group">
                <label>Availability</label>
                <div className="input-wrapper">
                  <Clock size={18} />
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="e.g., Mon - Fri"
                    required
                  />
                </div>
              </div>

              {/* Badge */}
              <div className="input-group">
                <label>Badge</label>
                <div className="input-wrapper">
                  <Award size={18} />
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="e.g., Top Rated"
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="input-group">
                <label>Languages (comma separated)</label>
                <div className="input-wrapper">
                  <CheckCircle size={18} />
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    placeholder="e.g., English, Hindi, Telugu"
                  />
                </div>
              </div>

            </div>

            {/* Image URL */}
            <div className="input-group" style={{ marginTop: '0.5rem' }}>
              <label>Profile Image URL</label>
              <div className="input-wrapper">
                <ImageIcon size={18} />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => { setActiveTab('manage'); resetForm(); }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {loading ? <Loader2 className="spin" size={18} /> : null}
                {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Doctor' : 'Add Doctor')}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AddDoctorPage;
