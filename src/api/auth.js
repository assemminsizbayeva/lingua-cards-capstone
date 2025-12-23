import axios from "axios";
import { API_CONFIG, ENDPOINTS } from "./config.js";

export const authAPI = {
  register: async (email, password, name) => {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.REGISTER}`, {
      email,
      password,
      name,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
      email,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
