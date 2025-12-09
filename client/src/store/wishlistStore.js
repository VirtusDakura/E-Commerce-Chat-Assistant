import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,

      // Helper to get product ID (handles different ID field names from backend)
      getProductId: (product) => product.id || product._id || product.productId,

      // Actions
      addItem: (product) => {
        const { items, getProductId } = get();
        const productId = getProductId(product);
        const exists = items.some((item) => getProductId(item) === productId);

        if (!exists) {
          set({
            items: [...items, {
              id: productId,
              _id: product._id,
              productId: product.productId,
              name: product.name || product.title,
              price: product.price,
              savedPrice: product.price, // For price tracking
              currency: product.currency || 'GHS',
              image: product.image || product.images?.[0],
              productUrl: product.productUrl || product.externalUrl,
              marketplace: product.marketplace || 'jumia',
              addedAt: new Date().toISOString(),
            }],
          });
        }
      },

      removeItem: (productId) => {
        const { items, getProductId } = get();
        set({
          items: items.filter((item) => getProductId(item) !== productId),
        });
      },

      toggleItem: (product) => {
        const { items, addItem, removeItem, getProductId } = get();
        const productId = getProductId(product);
        const exists = items.some((item) => getProductId(item) === productId);

        if (exists) {
          removeItem(productId);
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
        const { items, getProductId } = get();
        return items.some((item) => getProductId(item) === productId);
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
