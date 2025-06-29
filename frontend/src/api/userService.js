import axios from '../utils/httpClient';
import { API_CONFIG } from '../config/apiConfig';

const USERS_ENDPOINT = API_CONFIG.ENDPOINTS.USERS;

export const userService = {

  getUsers: async (page = API_CONFIG.PAGINATION.DEFAULT_PAGE, size = API_CONFIG.PAGINATION.DEFAULT_SIZE) => {
    try {
      const response = await axios.get(USERS_ENDPOINT, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${USERS_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`User with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch user with ID ${id}: ${error.message}`);
    }
  },

  getUserByEmail: async (email) => {
    try {
      const response = await axios.get(`${USERS_ENDPOINT}/email`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user with email ${email}: ${error.message}`);
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post(USERS_ENDPOINT, userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Invalid user data or email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${USERS_ENDPOINT}/${id}`, userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`User with ID ${id} not found`);
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid user data or email already exists');
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  deleteUser: async (id) => {
    try {
      await axios.delete(`${USERS_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`User with ID ${id} not found`);
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

export default userService;
