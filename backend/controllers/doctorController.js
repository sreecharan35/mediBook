const Doctor = require('../models/Doctor');
const { asyncHandler } = require('../middleware/errorHandler');

// Seed data to be used if database is empty
const seedDoctors = [
  { name: 'Dr. Rajesh Sharma', specialty: 'Cardiologist', experience: 15, rating: 4.9, reviews: 450, availability: 'Mon - Fri', hospital: 'Apollo Hospitals', fee: 1500, badge: 'Top Rated', languages: ['English', 'Hindi', 'Telugu'], image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Dr. Priya Desai', specialty: 'Neurologist', experience: 12, rating: 4.8, reviews: 320, availability: 'Tue - Sat', hospital: 'Fortis Healthcare', fee: 1200, badge: 'Expert', languages: ['English', 'Hindi', 'Marathi'], image: 'https://images.unsplash.com/photo-1594824436998-d886866f7f32?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Dr. Ananya Reddy', specialty: 'Pediatrician', experience: 10, rating: 4.9, reviews: 500, availability: 'Mon - Sat', hospital: 'Rainbow Children\'s Hospital', fee: 800, badge: 'Top Rated', languages: ['English', 'Telugu', 'Hindi'], image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Dr. Vikram Singh', specialty: 'Orthopedic', experience: 20, rating: 4.7, reviews: 280, availability: 'Mon - Thu', hospital: 'Max Super Speciality', fee: 1000, badge: 'Senior', languages: ['English', 'Hindi', 'Punjabi'], image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Dr. Meera Iyer', specialty: 'Dermatologist', experience: 8, rating: 4.8, reviews: 410, availability: 'Wed - Sun', hospital: 'Kaya Skin Clinic', fee: 900, badge: 'Popular', languages: ['English', 'Tamil', 'Hindi'], image: 'https://images.unsplash.com/photo-1527613426496-f139ce96c5a6?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Dr. Sanjay Gupta', specialty: 'General Physician', experience: 18, rating: 4.6, reviews: 600, availability: 'Mon - Fri', hospital: 'Manipal Hospitals', fee: 600, badge: 'Available Now', languages: ['English', 'Hindi', 'Kannada'], image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300' },
];

// GET /api/doctors
const getAllDoctors = asyncHandler(async (req, res) => {
  // Check if we need to seed the database
  const count = await Doctor.countDocuments();
  if (count === 0) {
    console.log('Seeding doctors into MongoDB...');
    await Doctor.insertMany(seedDoctors);
  }

  const { specialty, minRating, maxFee, search } = req.query;
  let query = {};
  
  if (specialty) query.specialty = new RegExp('^' + specialty + '$', 'i');
  if (minRating) query.rating = { $gte: parseFloat(minRating) };
  if (maxFee) query.fee = { $lte: parseInt(maxFee) };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialty: { $regex: search, $options: 'i' } },
      { hospital: { $regex: search, $options: 'i' } }
    ];
  }

  const doctors = await Doctor.find(query);
  // Map _id to id for frontend compatibility
  const formattedDoctors = doctors.map(d => ({ ...d._doc, id: d._id }));
  res.json({ count: formattedDoctors.length, doctors: formattedDoctors });
});

// GET /api/doctors/:id
const getDoctorById = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found.' });
    res.json({ ...doctor._doc, id: doctor._id });
  } catch (error) {
    return res.status(404).json({ error: 'Doctor not found.' }); // Handle invalid ObjectId
  }
});

// GET /api/doctors/:id/slots
const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const booked = ['10:00', '14:30']; // mock booked slots
  res.json({ date: date || new Date().toISOString().split('T')[0], slots: slots.map(s => ({ time: s, available: !booked.includes(s) })) });
});

// POST /api/doctors
const createDoctor = asyncHandler(async (req, res) => {
  const { name, specialty, experience, rating, reviews, availability, hospital, fee, badge, languages, image } = req.body;

  if (!name || !specialty || !hospital || fee === undefined) {
    return res.status(400).json({ error: 'Please provide all required fields (name, specialty, hospital, fee).' });
  }

  const doctor = new Doctor({
    name,
    specialty,
    experience: experience || 0,
    rating: rating || 5.0,
    reviews: reviews || 0,
    availability: availability || 'Mon - Fri',
    hospital,
    fee,
    badge: badge || 'New',
    languages: languages || ['English'],
    image: image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
  });

  const createdDoctor = await doctor.save();
  res.status(201).json({ ...createdDoctor._doc, id: createdDoctor._id });
});

module.exports = { getAllDoctors, getDoctorById, getAvailableSlots, createDoctor };
