const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const appointmentService = {
  async createAppointment(appointmentData) {
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        // Adapt format to what backend expects
        body: JSON.stringify({
          doctorId: appointmentData.doctor_id,
          doctorName: appointmentData.doctorName || 'Unknown Doctor',
          specialty: appointmentData.specialty || 'General',
          date: appointmentData.date,
          time: appointmentData.time,
          patientName: appointmentData.patientName || 'Patient',
          patientEmail: appointmentData.patientEmail || 'patient@demo.com',
          patientPhone: appointmentData.patientPhone || '',
          reason: appointmentData.symptoms,
        })
      });
      if (!res.ok) throw new Error('Failed to create appointment');
      const data = await res.json();
      return data.appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  async getPatientAppointments(patientId) {
    // Note: patientId in MongoDB might be just from token, but backend currently looks at patientEmail or userId
    try {
      // Pass a dummy email or we rely on token if we implement it. For now, fetch all or for specific email
      const res = await fetch(`${API_URL}/api/appointments`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      
      // Map to frontend expected format
      return data.appointments.map(appt => ({
        id: appt.id,
        appointment_id: appt.confirmationCode,
        doctor_id: appt.doctorId,
        appointment_date: appt.date,
        time_slot: appt.time,
        symptoms: appt.reason,
        status: appt.status,
        doctors: {
          specialty: appt.specialty,
          profiles: { full_name: appt.doctorName, avatar_url: '' }
        }
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async updateAppointmentStatus(id, status) {
    try {
      let endpoint = '';
      if (status.toLowerCase() === 'cancelled') endpoint = 'cancel';
      if (status.toLowerCase() === 'rescheduled') endpoint = 'reschedule'; // Requires date/time, keeping simple

      const res = await fetch(`${API_URL}/api/appointments/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      return data.appointment;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }
};
