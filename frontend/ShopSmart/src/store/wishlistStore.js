import { create } from "zustand";

export const useWishlistStore = create((set) => ({
    items: [],
    add: (product) =>
        set((state) => ({ items: state.items.find(i => i.id === product.id) ? state.items : [...state.items, product] })),
    remove: (id) =>
        set((state) => ({ items: state.items.filter(i => i.id !== id) })),
    moveToCart: (id, cartStore) =>
        set((state) => {
            const product = state.items.find(i => i.id === id);
            if (!product) return state;
            cartStore.addItem(product);
            return { items: state.items.filter(i => i.id !== id) };
        })
}));
