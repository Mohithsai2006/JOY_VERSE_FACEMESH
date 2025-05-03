import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/superadmin.css';

const SuperAdmin = () => {
  const [activeSection, setActiveSection] = useState('register'); // Default to 'register'
  const [admins, setAdmins] = useState([]);
  const [adminData, setAdminData] = useState({
    name: '',
    phone: '',
    email: '',
    profilePhoto: null,
    password: '',
  });
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For Update section
  const [phoneToDelete, setPhoneToDelete] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch admins only when token is valid
  const fetchAdmins = useCallback(async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/superadmin/admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setMessage('Failed to fetch admins');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('superadmin_token');
    if (!token) {
      navigate('/superadmin-login');
      return;
    }

    fetchAdmins(token);
  }, [navigate, fetchAdmins]);

  const handleAdminRegistration = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('superadmin_token');
    if (!token) {
      navigate('/superadmin-login');
      return;
    }

    const formData = new FormData();
    formData.append('name', adminData.name);
    formData.append('phone', adminData.phone);
    formData.append('email', adminData.email);
    if (adminData.profilePhoto) {
      formData.append('profilePhoto', adminData.profilePhoto);
    }
    formData.append('password', adminData.password);

    try {
      const response = await axios.post('http://localhost:3000/superadmin/register-admin', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setAdmins(prev => [...prev, response.data.admin]);
      setAdminData({ name: '', phone: '', email: '', profilePhoto: null, password: '' });
      // Clear file input
      document.getElementById('profilePhoto').value = null;
    } catch (error) {
      console.error('Error registering admin:', error);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleToggleAdmin = async (active) => {
    if (!selectedAdmin) {
      setMessage('Please select an admin');
      return;
    }

    const token = localStorage.getItem('superadmin_token');
    try {
      const response = await axios.put(
        'http://localhost:3000/superadmin/toggle-admin',
        { phone: selectedAdmin.phone, active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setAdmins(prev =>
        prev.map(admin =>
          admin.phone === selectedAdmin.phone ? response.data.admin : admin
        )
      );
      setSelectedAdmin(null); // Clear selection after action
    } catch (error) {
      console.error('Error toggling admin:', error);
      setMessage(error.response?.data?.message || 'Error toggling admin');
    }
  };

  const handleDeleteAdmin = async () => {
    if (!phoneToDelete) {
      setMessage('Please enter a phone number');
      return;
    }

    const token = localStorage.getItem('superadmin_token');
    try {
      const response = await axios.delete(`http://localhost:3000/superadmin/delete-admin/${phoneToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setAdmins(prev => prev.filter(admin => admin.phone !== phoneToDelete));
      setPhoneToDelete('');
    } catch (error) {
      console.error('Error deleting admin:', error);
      setMessage(error.response?.data?.message || 'Error deleting admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superadmin_token');
    navigate('/superadmin-login');
  };

  return (
    <div className="superadmin-container">
      <nav className="superadmin-nav">
        <button onClick={() => setActiveSection('register')}>Register</button>
        <button onClick={() => setActiveSection('listOfAdmins')}>List of Admins</button>
        <button onClick={() => setActiveSection('update')}>Update</button>
        <button onClick={() => setActiveSection('delete')}>Delete</button>
      </nav>
      <h1>SuperAdmin Dashboard</h1>
      {message && <p className="message">{message}</p>}

      <div className="admin-content">
        {activeSection === 'register' && (
          <div className="admin-registration">
            <h2>Register New Admin</h2>
            <form onSubmit={handleAdminRegistration}>
              <input
                type="text"
                placeholder="Admin Name"
                value={adminData.name}
                onChange={e => setAdminData({ ...adminData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={adminData.phone}
                onChange={e => setAdminData({ ...adminData, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={adminData.email}
                onChange={e => setAdminData({ ...adminData, email: e.target.value })}
                required
              />
              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={e => setAdminData({ ...adminData, profilePhoto: e.target.files[0] })}
              />
              <input
                type="password"
                placeholder="Password"
                value={adminData.password}
                onChange={e => setAdminData({ ...adminData, password: e.target.value })}
                required
              />
              <button type="submit">Register Admin</button>
            </form>
          </div>
        )}

        {activeSection === 'listOfAdmins' && (
          <div className="admin-list">
            <h2>Registered Admins</h2>
            {admins.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.phone}>
                      <td>{admin.name}</td>
                      <td>{admin.phone}</td>
                      <td>{admin.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No admins registered yet.</p>
            )}
          </div>
        )}

        {activeSection === 'update' && (
          <div className="admin-actions">
            <h2>Update Admin</h2>
            <div className="admin-selector">
              <select
                value={selectedAdmin ? selectedAdmin.phone : ''}
                onChange={e => {
                  const admin = admins.find(a => a.phone === e.target.value);
                  setSelectedAdmin(admin || null);
                }}
              >
                <option value="">Select an admin</option>
                {admins.map(admin => (
                  <option key={admin.phone} value={admin.phone}>
                    {admin.name} ({admin.phone})
                  </option>
                ))}
              </select>
            </div>
            {selectedAdmin && (
              <>
                <button onClick={() => handleToggleAdmin(true)}>Enable Admin</button>
                <button onClick={() => handleToggleAdmin(false)}>Disable Admin</button>
                <button onClick={() => setSelectedAdmin(null)}>Cancel</button>
              </>
            )}
            {!selectedAdmin && <p>Please select an admin to update.</p>}
          </div>
        )}

        {activeSection === 'delete' && (
          <div className="admin-actions">
            <h2>Delete Admin</h2>
            <input
              type="text"
              placeholder="Enter phone number to delete"
              value={phoneToDelete}
              onChange={e => setPhoneToDelete(e.target.value)}
            />
            <button onClick={handleDeleteAdmin}>Delete Admin</button>
          </div>
        )}
      </div>

      <div className="footer">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default SuperAdmin;