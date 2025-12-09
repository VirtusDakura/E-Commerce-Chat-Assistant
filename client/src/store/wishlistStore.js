import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistService } from '../services/wishlistService';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,

      // Helper to get product ID (handles different ID field names from backend)
      getProductId: (product) => product.id || product._id || product.productId,

      // Fetch wishlist from backend (for authenticated users)
      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await wishlistService.getWishlist();
          // Backend returns { items: [...] } with populated product info
          const backendItems = response.data.items.map((item) => ({
            id: item._id,
            _id: item._id,
            productId: item.product?.productId || item.product?._id,
            name: item.product?.name,
            price: item.currentPrice || item.product?.price,
            savedPrice: item.savedPrice,
            currency: 'GHS',
            image: item.product?.images?.[0],
            productUrl: item.product?.externalUrl,
            marketplace: item.product?.platform || 'jumia',
            addedAt: item.addedAt,
            priceChanged: item.priceChanged,
            priceDropped: item.priceDropped,
          }));
          set({ items: backendItems, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
          set({ isLoading: false, error: error.message });
        }
      },

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
