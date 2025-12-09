import { create } from "zustand";

export const useUserStore = create((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    login: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null })
}));

