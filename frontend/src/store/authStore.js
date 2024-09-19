import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;


export const useProjectStore = create((set) => ({
  projects: [],
  error: null,

  createProject: async (projectData) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      set((state) => ({
        projects: [...state.projects, response.data.project],
      }));
    } catch (error) {
      console.error('Errore nel salvataggio del progetto:', error);
      set({ error: error.response?.data?.message || 'Errore durante la creazione del progetto' });
    }
  },

  // Funzione per ottenere tutti i progetti
  fetchProjects: async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      set({ projects: response.data.projects });
    } catch (error) {
      console.error('Errore nel recupero dei progetti:', error);
      set({ error: error.response?.data?.message || 'Errore durante il recupero dei progetti' });
    }
  },
}));


export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
  createEmployer: async ({ name, surname, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/create-employer`, {
        name,
        surname,
        email,
        password,
      });
      set({ isLoading: false, message: "Employer creato con successo!" });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Errore nella creazione dell'employer",
      });
    }
  },
  loginEmployer: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/employer-login`, {
        email,
        password,
      });
      set({
        user: {
          ...response.data.employer,
          isEmployer: true, // Imposta il campo isEmployer a true
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in as Employer",
        isLoading: false,
      });
      throw error;
    }
  },
  fetchTimetable: async (month, year) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/timetable/${month}/${year}`);
      set({
        timetable: response.data.timetable,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Errore nel recuperare la tabella oraria",
        isLoading: false,
      });
      throw error;
    }
  },

  // Funzione per aggiornare lo stato di un giorno
  updateDayStatus: async (dayId, isWorkingDay) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/timetable/day-status/${dayId}`, {
        isWorkingDay,
      });
      set({ isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Errore nell'aggiornare lo stato del giorno",
        isLoading: false,
      });
      throw error;
    }
  },

  // Funzione per aggiungere un giustificativo
  addJustification: async (dayId, justificationType, employerId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/timetable/justification`, {
        dayId,
        justificationType,
        employerId,
      });
      set({ isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Errore nell'aggiungere il giustificativo",
        isLoading: false,
      });
      throw error;
    }
  },

  // Funzione per assegnare un progetto a un giorno
  assignProject: async (dayId, projectId, employerIds) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/timetable/project`, {
        dayId,
        projectId,
        employerIds,
      });
      set({ isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Errore nell'assegnare il progetto",
        isLoading: false,
      });
      throw error;
    }
  },
}));
