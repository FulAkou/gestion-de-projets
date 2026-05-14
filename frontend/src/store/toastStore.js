import { create } from 'zustand';

let toastId = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = toastId++;
    set((state) => ({
      toasts: [...state.toasts, { id, ...toast }],
    }));
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  // Helper methods
  success: (message, duration = 5000) => {
    const id = toastId++;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'success', duration }],
    }));
  },
  
  error: (message, duration = 5000) => {
    const id = toastId++;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'error', duration }],
    }));
  },
  
  warning: (message, duration = 5000) => {
    const id = toastId++;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'warning', duration }],
    }));
  },
  
  info: (message, duration = 5000) => {
    const id = toastId++;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'info', duration }],
    }));
  },
}));
