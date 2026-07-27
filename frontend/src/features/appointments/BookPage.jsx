import { useState, useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, User, Stethoscope,
  Calendar, CheckSquare, Search, SlidersHorizontal,
  Star, Edit3, UserCheck, Clock, MapPin, Phone, Mail,
  AlertCircle
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { bookingSchema, stepFields } from '../../utils/bookingSchemas';
import { generateAppointmentId, formatDate, formatTime } from '../../utils/appointmentUtils';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { webhookService } from '../../services/webhookService';

import StepIndicator from './components/StepIndicator';
import FormField from './components/FormField';
import DoctorCard from './components/DoctorCard';
import BookingCalendar from './components/BookingCalendar';
import TimeSlotGrid from './components/TimeSlotGrid';
import BookingSuccess from './components/BookingSuccess';

// ─── Constants ───────────────────────────────────────────────────
const STEPS = ['Patient Info', 'Doctor', 'Appointment', 'Confirm'];

const DEPARTMENTS = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Dermatologist', 'General Physician'];

const pageVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
};

// ─── Step 1: Patient Information ────────────────────────────────
const PatientInfoStep = () => (
  <div className="booking-step-content">
    <div className="step-header">
      <div className="step-icon-wrap" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
        <User size={22} color="white" />
      </div>
      <div>
        <h2 className="step-title">Patient Information</h2>
        <p className="step-desc">Tell us about yourself so we can personalize your care</p>
      </div>
    </div>

    <div className="booking-fields-grid">
      <FormField name="name" label="Full Name" type="text" placeholder="e.g. John Doe" icon={User} required />
      <FormField name="email" label="Email Address" type="email" placeholder="you@example.com" icon={Mail} required />
      <FormField name="phone" label="Phone Number" type="tel" placeholder="+91 98765 43210" icon={Phone} required />
      <FormField name="age" label="Age" type="number" placeholder="e.g. 32" required
        hint="Enter your current age in years" />

      <div style={{ gridColumn: '1 / -1' }}>
        <FormField
          name="gender"
          label="Gender"
          type="radio"
          required
          options={[
            { value: 'male', label: 'Male', icon: '♂' },
            { value: 'female', label: 'Female', icon: '♀' },
            { value: 'other', label: 'Other', icon: '⚧' },
          ]}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <FormField
          name="address"
          label="Address"
          type="textarea"
          placeholder="House no., Street, City, State, ZIP code"
          required
        />
      </div>
    </div>
  </div>
);

// ─── Step 2: Doctor Selection ────────────────────────────────────
const DoctorSelectionStep = ({ control, setValue, watch }) => {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [minExp, setMinExp] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Fetch doctors dynamically
  useEffect(() => {
    doctorService.getAllDoctors().then(data => {
      setDoctorsList(data);
      setLoadingDocs(false);
    }).catch(console.error);
  }, []);

  const selectedId = watch('doctorId');

  const filtered = doctorsList.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || d.specialty === dept;
    const matchExp = !minExp || parseInt(d.experience) >= parseInt(minExp);
    const matchRating = !minRating || d.rating >= parseFloat(minRating);
    return matchSearch && matchDept && matchExp && matchRating;
  });

  const handleSelect = (doctor) => {
    setValue('doctorId', String(doctor.id), { shouldValidate: true });
    setValue('doctorName', String(doctor.name));
    setValue('doctorSpecialty', String(doctor.specialty));
    setValue('doctorFee', String(doctor.fee));
    // Reset appointment on doctor change
    setValue('date', '');
    setValue('time', '');
  };

  return (
    <div className="booking-step-content">
      <div className="step-header">
        <div className="step-icon-wrap" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
          <Stethoscope size={22} color="white" />
        </div>
        <div>
          <h2 className="step-title">Choose Your Doctor</h2>
          <p className="step-desc">Select from our {doctorsList.length} verified specialists</p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="doctor-search-bar">
        <div className="doctor-search-input-wrap">
          <Search size={16} className="search-icon-inline" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or specialty…"
            className="doctor-search-input"
          />
        </div>
        <button
          type="button"
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(f => !f)}
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="doctor-filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="filters-inner">
              <div className="filter-group">
                <label className="booking-label">Department</label>
                <div className="filter-chip-row">
                  {DEPARTMENTS.map(d => (
                    <button
                      key={d} type="button"
                      className={`filter-chip ${dept === d ? 'active' : ''}`}
                      onClick={() => setDept(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="filter-group" style={{ flex: 1, minWidth: 160 }}>
                  <label className="booking-label">Min. Experience (yrs)</label>
                  <input type="number" value={minExp} onChange={e => setMinExp(e.target.value)}
                    placeholder="e.g. 5" className="booking-input" style={{ maxWidth: 120 }} />
                </div>
                <div className="filter-group" style={{ flex: 1, minWidth: 160 }}>
                  <label className="booking-label">Min. Rating</label>
                  <div className="filter-chip-row">
                    {['4.5', '4.7', '4.9'].map(r => (
                      <button key={r} type="button"
                        className={`filter-chip ${minRating === r ? 'active' : ''}`}
                        onClick={() => setMinRating(minRating === r ? '' : r)}>
                        <Star size={11} fill={minRating === r ? '#f59e0b' : 'none'} color="#f59e0b" /> {r}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(search || dept !== 'All' || minExp || minRating) && (
                <button type="button" className="clear-filters-btn"
                  onClick={() => { setSearch(''); setDept('All'); setMinExp(''); setMinRating(''); }}>
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="results-count">
        <strong>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Doctor list */}
      <Controller
        name="doctorId"
        control={control}
        render={({ fieldState: { error } }) => (
          <>
            <div className="doctor-list">
              <AnimatePresence>
                {filtered.length > 0 ? (
                  filtered.map((doc, i) => (
                    <motion.div key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <DoctorCard
                        doctor={doc}
                        selected={selectedId === doc.id}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="empty-results">
                    <Stethoscope size={36} />
                    <p>No doctors match your filters</p>
                    <button type="button" onClick={() => { setSearch(''); setDept('All'); setMinExp(''); setMinRating(''); }}
                      className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginTop: '0.5rem' }}>
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {error && (
              <p className="booking-field-error" style={{ marginTop: '0.75rem' }}>
                <AlertCircle size={12} /> {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

// ─── Step 3: Appointment Scheduling ─────────────────────────────
const AppointmentStep = ({ control, watch }) => {
  const doctorId = watch('doctorId');
  const doctorName = watch('doctorName');
  const doctorFee = watch('doctorFee');
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  return (
    <div className="booking-step-content">
      <div className="step-header">
        <div className="step-icon-wrap" style={{ background: 'linear-gradient(135deg, #0891b2, #10b981)' }}>
          <Calendar size={22} color="white" />
        </div>
        <div>
          <h2 className="step-title">Schedule Appointment</h2>
          <p className="step-desc">Pick a date and time that works for you</p>
        </div>
      </div>

      {/* Doctor summary pill */}
      {doctorId && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="selected-doctor-pill">
          <UserCheck size={14} />
          <span>{doctorName}</span>
          <span className="pill-separator">·</span>
          <span style={{ color: 'var(--brand-600)', fontWeight: 700 }}>{doctorFee}</span>
        </motion.div>
      )}

      {/* Appointment type */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="booking-label">Appointment Type</label>
        <Controller
          name="type"
          control={control}
          defaultValue="in-person"
          render={({ field }) => (
            <div className="appt-type-row">
              {[
                { value: 'in-person', label: '🏥 In-Person' },
                { value: 'video', label: '📹 Video Call' },
                { value: 'phone', label: '📞 Phone Call' },
              ].map(t => (
                <button key={t.value} type="button"
                  onClick={() => field.onChange(t.value)}
                  className={`appt-type-btn ${field.value === t.value ? 'active' : ''}`}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="appt-layout">
        {/* Calendar */}
        <div>
          <label className="booking-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
            Select Date <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <BookingCalendar
                  value={field.value}
                  onChange={field.onChange}
                  doctorId={doctorId}
                />
                {error && (
                  <p className="booking-field-error">
                    <AlertCircle size={12} /> {error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Time slots */}
        <div>
          <label className="booking-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
            Select Time <span style={{ color: '#ef4444' }}>*</span>
            {selectedDate && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem', fontSize: '0.78rem' }}>
                ({new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
              </span>
            )}
          </label>
          <Controller
            name="time"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <TimeSlotGrid
                  doctorId={doctorId}
                  date={selectedDate}
                  value={field.value}
                  onChange={(time) => { field.onChange(time); }}
                />
                {error && (
                  <p className="booking-field-error" style={{ marginTop: '0.5rem' }}>
                    <AlertCircle size={12} /> {error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Step 4: Confirmation ────────────────────────────────────────
const ConfirmationStep = ({ data, onEdit }) => {
  const sections = [
    {
      title: 'Patient Details',
      icon: User,
      stepIndex: 0,
      color: '#2563eb',
      rows: [
        { label: 'Full Name', value: data.name },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
        { label: 'Gender', value: data.gender?.charAt(0).toUpperCase() + data.gender?.slice(1) },
        { label: 'Age', value: `${data.age} years` },
        { label: 'Address', value: data.address },
      ],
    },
    {
      title: 'Selected Doctor',
      icon: Stethoscope,
      stepIndex: 1,
      color: '#7c3aed',
      rows: [
        { label: 'Doctor', value: data.doctorName },
        { label: 'Specialty', value: data.doctorSpecialty },
        { label: 'Fee', value: `₹${Number(data.doctorFee * 83).toLocaleString('en-IN')} / session` },
      ],
    },
    {
      title: 'Appointment',
      icon: Calendar,
      stepIndex: 2,
      color: '#0891b2',
      rows: [
        { label: 'Date', value: formatDate(data.date) },
        { label: 'Time', value: formatTime(data.time) },
        { label: 'Type', value: data.type === 'in-person' ? '🏥 In-Person' : data.type === 'video' ? '📹 Video Call' : '📞 Phone Call' },
      ],
    },
  ];

  return (
    <div className="booking-step-content">
      <div className="step-header">
        <div className="step-icon-wrap" style={{ background: 'linear-gradient(135deg, #ea580c, #f59e0b)' }}>
          <CheckSquare size={22} color="white" />
        </div>
        <div>
          <h2 className="step-title">Review & Confirm</h2>
          <p className="step-desc">Please verify all details before booking</p>
        </div>
      </div>

      <div className="confirm-sections">
        {sections.map(sec => (
          <motion.div
            key={sec.title}
            className="confirm-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="confirm-card-header">
              <div className="confirm-card-icon" style={{ background: `${sec.color}18`, color: sec.color }}>
                <sec.icon size={16} />
              </div>
              <h3 className="confirm-card-title">{sec.title}</h3>
              <button
                type="button"
                className="edit-btn"
                onClick={() => onEdit(sec.stepIndex)}
                title={`Edit ${sec.title}`}
              >
                <Edit3 size={13} /> Edit
              </button>
            </div>

            <div className="confirm-rows">
              {sec.rows.map(row => (
                <div key={row.label} className="confirm-row">
                  <span className="confirm-row-label">{row.label}</span>
                  <span className="confirm-row-value">{row.value || '—'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="confirm-disclaimer">
        <AlertCircle size={13} />
        <span>By clicking "Book Appointment", you agree to our cancellation policy. Free cancellation up to 2 hours before your appointment.</span>
      </div>
    </div>
  );
};

// ─── Main BookPage ────────────────────────────────────────────────
const BookPage = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [success, setSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  const methods = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || '', email: user?.email || '', phone: '', gender: '', age: '', address: '',
      doctorId: undefined, doctorName: '', doctorSpecialty: '', doctorFee: '',
      date: '', time: '', type: 'in-person',
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger, getValues, setValue, watch, control, formState: { isValid } } = methods;

  // Pre-select doctor from URL query param ?doctorId=xxx
  useEffect(() => {
    const preselectedId = searchParams.get('doctorId');
    if (!preselectedId) return;
    doctorService.getDoctorById(preselectedId)
      .then(doctor => {
        if (!doctor) return;
        setValue('doctorId', String(doctor.id || doctor._id), { shouldValidate: true });
        setValue('doctorName', String(doctor.name));
        setValue('doctorSpecialty', String(doctor.specialty));
        setValue('doctorFee', String(doctor.fee));
      })
      .catch(() => {});
  }, [searchParams]);

  const goNext = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (!valid) return;
    setDirection(1);
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (index) => {
    setDirection(index < step ? -1 : 1);
    setStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Create appointment in Supabase
      const newAppointment = await appointmentService.createAppointment({
        patient_id: 'b1000000-0000-0000-0000-000000000001', // Using Demo Patient ID for now
        doctor_id: data.doctorId,
        date: data.date,
        time: data.time,
        symptoms: data.symptoms || null
      });
      
      const aptId = newAppointment.appointment_id;

      // Trigger n8n Webhook
      webhookService.triggerBookingWorkflow({
        patientName: data.name,
        patientPhone: data.phone,
        patientEmail: data.email,
        doctorName: data.doctorName,
        doctorDepartment: data.doctorSpecialty,
        doctorHospital: 'MediBook Central Hospital', // Default for now
        date: data.date,
        time: data.time,
        appointmentId: aptId,
        status: 'Pending'
      });
      
      setAppointmentId(aptId);
      setSuccess(true);
    } catch (error) {
      console.error('Submission failed:', error);
      // Fallback/Error state handling could be added here
    } finally {
      setSubmitting(false);
    }
  };

  const stepComponents = [
    <PatientInfoStep />,
    <DoctorSelectionStep control={control} setValue={setValue} watch={watch} />,
    <AppointmentStep control={control} watch={watch} />,
    <ConfirmationStep data={getValues()} onEdit={goToStep} />,
  ];

  if (success) {
    return (
      <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem 3rem' }}>
        <div className="booking-card" style={{ maxWidth: 540 }}>
          <BookingSuccess appointmentId={appointmentId} data={getValues()} />
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--gradient-hero)' }}>
        <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '2.5rem' }}
          >
            <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
              <Calendar size={11} /> Smart Booking
            </span>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', marginBottom: '0.5rem' }}>
              Book Your <span className="text-gradient">Appointment</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Complete the steps below to schedule your visit
            </p>
          </motion.div>

          {/* Step indicator */}
          <StepIndicator currentStep={step} steps={STEPS} />

          {/* Form card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ maxWidth: 820, margin: '0 auto' }}>
              <div className="booking-card" style={{ overflow: 'hidden' }}>
                {/* Animated step content */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {stepComponents[step]}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation footer */}
                <div className="booking-nav">
                  <button
                    type="button"
                    className="btn btn-outline booking-nav-btn"
                    onClick={goBack}
                    disabled={step === 0}
                    style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}
                  >
                    <ChevronLeft size={17} /> Back
                  </button>

                  <div className="step-dots">
                    {STEPS.map((_, i) => (
                      <motion.div
                        key={i}
                        className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
                        animate={{ scale: i === step ? 1.3 : 1 }}
                      />
                    ))}
                  </div>

                  {step < 3 ? (
                    <motion.button
                      type="button"
                      className="btn btn-primary booking-nav-btn"
                      onClick={goNext}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Continue <ChevronRight size={17} />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      className="btn btn-primary booking-nav-btn"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {submitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'inline-block' }}
                          >
                            ⏳
                          </motion.span>
                          Booking…
                        </>
                      ) : (
                        <><CheckSquare size={17} /> Confirm Booking</>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default BookPage;
