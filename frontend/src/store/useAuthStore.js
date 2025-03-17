import axios from "axios";
import { create } from "zustand";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://chat-app-backend-mu-liard.vercel.app";

export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  loading: false,
  isAuthenticated: false,

  checkAuth: async () => {
    // console.log(axiosInstance.defaults.baseURL);

    try {
      const res = await axios.get(`${baseUrl}/api/auth/check`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      if (!res.data.data) {
        console.log("No user found");
        set({ user: null });
        set({ isAuthenticated: false });
        return;
      }
      console.log("User found");
      set({ user: res.data.data });
      set({ isAuthenticated: true });
      
    } catch (error) {
      console.log(error);
      set({ user: null });
      set({ isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  // Register user
  register: async (formData) => {
    set({ loading: true, error: null }); // Reset error before request
    try {
      const res = await axios.post(`${baseUrl}/api/auth/register`, formData, {
        withCredentials: true,
      });
      set({
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Registration failed",
        loading: false,
      });
      return false;
    }
  },

  // Login user
  login: async (formData) => {
    set({ loading: true, error: null }); // Reset error before request
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, formData, {
        withCredentials: true,
      });
      set({
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
      });

      return true;
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Login failed",
        loading: false,
      });
      return false;
    }
  },

  // Logout
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Clear errors
  clearErrors: () => {
    set({ error: null });
  },
}));
