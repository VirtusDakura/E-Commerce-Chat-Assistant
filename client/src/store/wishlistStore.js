import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,

      // Actions
      addItem: (product) => {
        const { items } = get();
        const exists = items.some((item) => item.id === product.id);

        if (!exists) {
          set({
            items: [...items, { ...product, addedAt: new Date().toISOString() }],
          });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== productId),
        });
      },

      toggleItem: (product) => {
        const { items, addItem, removeItem } = get();
        const exists = items.some((item) => item.id === product.id);

        if (exists) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      },

      clearWishlist: () => set({ items: [], error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Getters
      getItemCount: () => {
        const { items } = get();
        return items.length;
      },

      isInWishlist: (productId) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      getItems: () => {
        const { items } = get();
        return items;
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default useWishlistStore;
