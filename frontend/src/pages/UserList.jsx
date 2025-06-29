import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../api/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const navigate = useNavigate();

  // Load users with pagination
  const loadUsers = async (page = 0) => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getUsers(page, 10);
      setUsers(data.content);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load users. Please check if the backend server is running.');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search user by email
  const searchByEmail = async () => {
    if (!searchEmail.trim()) {
      setSearchResult(null);
      loadUsers(currentPage);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await userService.getUserByEmail(searchEmail);
      setSearchResult(user);
    } catch (err) {
      setError(`No user found with email: ${searchEmail}`);
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear search and return to list view
  const clearSearch = () => {
    setSearchEmail('');
    setSearchResult(null);
    loadUsers(currentPage);
  };

  // Handle user deletion
  const handleDelete = async (id, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await userService.deleteUser(id);
        setSuccess('User deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
        
        if (searchResult) {
          clearSearch();
        } else {
          loadUsers(currentPage);
        }
      } catch (err) {
        setError(err.message || 'Failed to delete user');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadUsers(page);
  };

  // Handle search input key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchByEmail();
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const displayUsers = searchResult ? [searchResult] : users;

  return (
    <div className="container fade-in">
      <div className="card">
        <h1 className="card-title">👥 User Management</h1>
        
        {/* Search Section */}
        <div className="search-container">
          <input
            type="email"
            className="form-control search-input"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <button className="btn btn-primary" onClick={searchByEmail}>
            🔍 Search
          </button>
          {searchResult && (
            <button className="btn btn-warning" onClick={clearSearch}>
              ❌ Clear
            </button>
          )}
          <Link to="/add" className="btn btn-success">
            ➕ Add New User
          </Link>
        </div>

        {/* Alerts */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Loading */}
        {loading && <div className="loading">⏳ Loading users...</div>}

        {/* Users Table */}
        {!loading && displayUsers.length > 0 && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.pays}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(user.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Users Message */}
        {!loading && displayUsers.length === 0 && !error && (
          <div className="loading">
            {searchResult === null ? 
              '📝 No users found. Add some users to get started!' : 
              '🔍 No user found with that email.'
            }
          </div>
        )}

        {/* Pagination */}
        {!loading && !searchResult && totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ⬅️ Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;