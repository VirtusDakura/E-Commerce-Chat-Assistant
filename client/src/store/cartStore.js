import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,

      // Helper to get product ID (handles different ID field names from backend)
      getProductId: (product) => product.id || product._id || product.productId,

      // Fetch cart from backend (for authenticated users)
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartService.getCart();
          // Backend returns { cart: { items: [...] }, platformGroups, totalEstimate }
          const backendItems = response.data.cart.items.map((item) => ({
            id: item._id,
            _id: item._id,
            productId: item.product?.productId || item.product?._id,
            name: item.product?.name || item.productName,
            price: item.price,
            currency: 'GHS',
            image: item.product?.images?.[0] || item.productImage,
            productUrl: item.product?.externalUrl || item.externalUrl,
            marketplace: item.platform || 'jumia',
            quantity: item.quantity,
          }));
          set({ items: backendItems, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ isLoading: false, error: error.message });
        }
      },

      // Actions
      addItem: (product, quantity = 1) => {
        const { items, getProductId } = get();
        const productId = getProductId(product);
        const existingItem = items.find((item) => getProductId(item) === productId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              getProductId(item) === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          // Store product with consistent fields for cart display
          set({
            items: [...items, {
              id: productId,
              _id: product._id,
              productId: product.productId,
              name: product.name || product.title,
              price: product.price,
              currency: product.currency || 'GHS',
              image: product.image || product.images?.[0],
              productUrl: product.productUrl || product.externalUrl,
              marketplace: product.marketplace || 'jumia',
              quantity,
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

      updateQuantity: (productId, quantity) => {
        const { items, getProductId } = get();
        if (quantity <= 0) {
          set({
            items: items.filter((item) => getProductId(item) !== productId),
          });
        } else {
          set({
            items: items.map((item) =>
              getProductId(item) === productId ? { ...item, quantity } : item
            ),
          });
        }
      },

      incrementQuantity: (productId) => {
        const { items, getProductId } = get();
        set({
          items: items.map((item) =>
            getProductId(item) === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decrementQuantity: (productId) => {
        const { items, removeItem, getProductId } = get();
        const item = items.find((i) => getProductId(i) === productId);
        
        if (item && item.quantity <= 1) {
          removeItem(productId);
        } else {
          set({
            items: items.map((i) =>
              getProductId(i) === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [], error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Getters
      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotal: () => {
        const { items } = get();
        const subtotal = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        // Can add tax, shipping, discounts here
        return subtotal;
      },

      isInCart: (productId) => {
        const { items, getProductId } = get();
        return items.some((item) => getProductId(item) === productId);
      },

      getItemQuantity: (productId) => {
        const { items, getProductId } = get();
        const item = items.find((i) => getProductId(i) === productId);
        return item ? item.quantity : 0;
      },

      // Get items grouped by marketplace/platform
      getItemsByPlatform: () => {
        const { items } = get();
        return items.reduce((groups, item) => {
          const platform = item.marketplace || 'other';
          if (!groups[platform]) {
            groups[platform] = [];
          }
          groups[platform].push(item);
          return groups;
        }, {});
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default useCartStore;
