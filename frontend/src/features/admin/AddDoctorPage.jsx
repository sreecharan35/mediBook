import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Activity, MapPin, Clock, Star, DollarSign, Image as ImageIcon, CheckCircle, Award, Loader2 } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import toast from 'react-hot-toast';

const AddDoctorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process languages into an array
      const langs = formData.languages.split(',').map(l => l.trim()).filter(l => l);
      
      const newDoctor = {
        ...formData,
        languages: langs.length > 0 ? langs : ['English'],
        experience: parseInt(formData.experience),
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        fee: parseInt(formData.fee),
      };

      await doctorService.addDoctor(newDoctor);
      toast.success('Doctor added successfully!');
      navigate('/doctors'); // Navigate to the public doctors page to see the new doctor
    } catch (err) {
      toast.error(err.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '2.5rem' }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-primary)' }}>
          Add New Doctor
        </h2>

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
              onClick={() => navigate('/dashboard')}
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
              {loading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDoctorPage;
