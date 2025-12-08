import { create } from "zustand";

export const useChatStore = create((set) => ({
    messages: [],
    typing: false,
    addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
    setTyping: (v) => set({ typing: v }),
    reset: () => set({ messages: [], typing: false })
}));
