import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { userService } from '../api/userService';

const UserForm = ({ isEdit = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    pays: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingUser, setLoadingUser] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Load user data for editing
  useEffect(() => {
    if (isEdit && id) {
      const loadUser = async () => {
        try {
          setLoadingUser(true);
          setError('');
          const user = await userService.getUserById(id);
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            pays: user.pays
          });
        } catch (err) {
          setError(err.message || 'Failed to load user data');
        } finally {
          setLoadingUser(false);
        }
      };
      loadUser();
    }
  }, [isEdit, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.pays.trim()) {
      setError('Country is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isEdit) {
        await userService.updateUser(id, formData);
        setSuccess('User updated successfully!');
      } else {
        await userService.createUser(formData);
        setSuccess('User created successfully!');
        // Clear form after successful creation
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          pays: ''
        });
      }

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setError(err.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="container fade-in">
        <div className="card">
          <div className="loading">⏳ Loading user data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <h1 className="card-title">
          {isEdit ? '✏️ Edit User' : '➕ Add New User'}
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country *</label>
            <input
              type="text"
              name="pays"
              className="form-control"
              value={formData.pays}
              onChange={handleInputChange}
              placeholder="Enter country"
              required
              disabled={loading}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 
                '⏳ Saving...' : 
                (isEdit ? '💾 Update User' : '➕ Create User')
              }
            </button>
            <Link to="/" className="btn btn-primary">
              ⬅️ Back to List
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;