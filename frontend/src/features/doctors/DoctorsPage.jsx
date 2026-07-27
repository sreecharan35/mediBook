import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Search, Star, MapPin, Clock, Calendar, CheckCircle,
  SlidersHorizontal, ChevronDown, X, Filter, Loader2
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { Link } from 'react-router-dom';

const specialties = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Dermatologist', 'General Physician'];
const sortOptions = ['Relevance', 'Rating (High)', 'Fee (Low)', 'Experience'];
const feeRanges = ['Any', 'Under ₹5,000', '₹5,000–₹10,000', 'Over ₹10,000'];

const DoctorCard = ({ doctor, index }) => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      className="glass-card doctor-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 3) * 0.07 }}
      whileHover={{ y: -5 }}
      layout
    >
      <div className="doctor-card-top">
        <motion.img src={doctor.image} alt={doctor.name} className="doctor-avatar" whileHover={{ scale: 1.06 }} />
        <div style={{ flex: 1 }}>
          <div className="doctor-name">{doctor.name}</div>
          <div className="doctor-spec">{doctor.specialty}</div>
          <div className="doctor-exp">{doctor.experience} experience</div>
          <div className="doctor-rating-row" style={{ marginTop: '0.4rem' }}>
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span className="rating-val">{doctor.rating}</span>
            <span>({doctor.reviews} reviews)</span>
          </div>
        </div>
        <div className="doctor-badge">{doctor.badge}</div>
      </div>
      <div className="doctor-info-row"><MapPin size={14} /><span>{doctor.hospital}</span></div>
      <div className="doctor-info-row"><Clock size={14} /><span>{doctor.availability}</span></div>
      <div className="doctor-info-row"><CheckCircle size={14} /><span>Speaks {doctor.languages?.join(', ')}</span></div>
      <div className="doctor-divider" />
      <div className="doctor-footer">
        <div className="doctor-fee">₹{(doctor.fee * 83).toLocaleString('en-IN')}<span> / session</span></div>
        <Link to={`/book?doctorId=${doctor.id}`}>
          <motion.button className="book-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={13} /> Book Now
            </span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

const DoctorsPage = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [feeRange, setFeeRange] = useState('Any');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState('Any');
  const [minExp, setMinExp] = useState('Any');
  const [availabilityFilter, setAvailabilityFilter] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        setDoctorsList(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = useMemo(() => {
    let list = [...doctorsList];
    if (search) list = list.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.hospital.toLowerCase().includes(search.toLowerCase())
    );
    if (specialty !== 'All') list = list.filter(d => d.specialty === specialty);
    if (feeRange === 'Under ₹5,000') list = list.filter(d => d.fee < 60);
    if (feeRange === '₹5,000–₹10,000') list = list.filter(d => d.fee >= 60 && d.fee <= 120);
    if (feeRange === 'Over ₹10,000') list = list.filter(d => d.fee > 120);
    
    if (minRating !== 'Any') {
      const min = parseFloat(minRating.replace('+', ''));
      list = list.filter(d => d.rating >= min);
    }
    if (minExp !== 'Any') {
      const min = parseInt(minExp);
      list = list.filter(d => parseInt(d.experience) >= min);
    }
    if (availabilityFilter !== 'Any') {
      if (availabilityFilter === 'Weekends') {
        list = list.filter(d => d.availability.includes('Sat') || d.availability.includes('Sun'));
      } else {
        list = list.filter(d => d.availability.includes(availabilityFilter));
      }
    }

    if (sortBy === 'Rating (High)') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Fee (Low)') list.sort((a, b) => a.fee - b.fee);
    if (sortBy === 'Experience') list.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    return list;
  }, [search, specialty, sortBy, feeRange, minRating, minExp, availabilityFilter, doctorsList]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentDoctors = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useMemo(() => setCurrentPage(1), [search, specialty, sortBy, feeRange, minRating, minExp, availabilityFilter, doctorsList]);

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--gradient-hero)', padding: '3.5rem 0 2.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>Our Specialists</span>
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
              Find Your <span className="text-gradient">Perfect Doctor</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
              Browse 1,500+ verified specialists across 50+ specialties
            </p>

            {/* Search bar */}
            <div style={{ position: 'relative', maxWidth: 600 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, specialty, or hospital..."
                className="search-input"
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Filters row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {/* Specialty tabs */}
          <div className="filter-tabs" style={{ margin: 0, flex: 1, justifyContent: 'flex-start' }}>
            {specialties.map(s => (
              <motion.button key={s} className={`filter-tab ${specialty === s ? 'active' : ''}`} onClick={() => setSpecialty(s)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {s}
              </motion.button>
            ))}
          </div>

          {/* Advanced Filters Button */}
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
            <button 
              className={`btn btn-outline ${showFilters ? 'active' : ''}`} 
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              <Filter size={16} /> Filters
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: '2rem' }}
            >
              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Fee Range</label>
                  <select value={feeRange} onChange={e => setFeeRange(e.target.value)} className="filter-select" style={{ width: '100%' }}>
                    {feeRanges.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Minimum Rating</label>
                  <select value={minRating} onChange={e => setMinRating(e.target.value)} className="filter-select" style={{ width: '100%' }}>
                    {['Any', '4.8+', '4.5+', '4.0+'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Experience</label>
                  <select value={minExp} onChange={e => setMinExp(e.target.value)} className="filter-select" style={{ width: '100%' }}>
                    {['Any', '5+ Years', '10+ Years', '15+ Years'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Availability</label>
                  <select value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)} className="filter-select" style={{ width: '100%' }}>
                    {['Any', 'Mon - Fri', 'Sat', 'Sun', 'Weekends'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Result count */}
        <motion.p layout style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> doctors
          {specialty !== 'All' && <> · <span style={{ color: 'var(--brand-600)' }}>{specialty}</span></>}
        </motion.p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <>
            <motion.div className="doctors-grid" layout>
              <AnimatePresence>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Loader2 className="spin" size={32} color="var(--brand-500)" />
              </div>
            ) : currentDoctors.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} index={i} />
            ))}
          </AnimatePresence>
            </motion.div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Search size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No doctors match your search</p>
            <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters or search term</p>
            <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => { setSearch(''); setSpecialty('All'); setFeeRange('Any'); }}>
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
