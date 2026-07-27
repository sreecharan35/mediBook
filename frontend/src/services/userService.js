const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const userService = {
  async getAllUsers() {
    const token = localStorage.getItem('medibook_token') || sessionStorage.getItem('medibook_token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${API_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to fetch users');
    }
    return await res.json();
  },

  async updateUserRole(userId, role) {
    const token = localStorage.getItem('medibook_token') || sessionStorage.getItem('medibook_token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update user role');
    }
    return await res.json();
  }
};
