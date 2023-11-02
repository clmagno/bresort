// src/stores/authStore.js
import { defineStore } from "pinia";

// Utility function to load persisted state
function loadState(key) {
  const storedState = localStorage.getItem(key);
  return storedState ? JSON.parse(storedState) : null;
}

// Utility function to save state to localStorage
function saveState(key, state) {
  localStorage.setItem(key, JSON.stringify(state));
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: loadState("user"), // Load the persisted user state
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      saveState("user", userData); // Save the user state to localStorage
    },
    logout() {
      this.user = null;
      saveState("user", null); // Remove the user state from localStorage
    },
  },
});
