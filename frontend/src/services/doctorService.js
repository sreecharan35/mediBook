const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const doctorService = {
  async getAllDoctors() {
    try {
      const res = await fetch(`${API_URL}/api/doctors`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      return data.doctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  async getDoctorById(id) {
    try {
      const res = await fetch(`${API_URL}/api/doctors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch doctor');
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  },

  async addDoctor(doctorData) {
    try {
      const res = await fetch(`${API_URL}/api/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add doctor');
      }
      return await res.json();
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw error;
    }
  }
};
