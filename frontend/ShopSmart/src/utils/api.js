// Mock API to simulate backend responses
// Replace with real API calls when backend is ready

import { products, getProductById as getProduct, getProductsByCategory, getFeaturedProducts, searchProducts as search } from '../data/products';
import { getReviewsForProduct } from '../data/reviews';

export const mockApi = {
    // Get all products or search by query
    getProducts: async (query = "") => {
        await new Promise(r => setTimeout(r, 300));
        if (!query) return products;
        return search(query);
    },

    // Get single product by ID
    getProductById: async (id) => {
        await new Promise(r => setTimeout(r, 200));
        return getProduct(id) || null;
    },

    // Get products by category
    getProductsByCategory: async (category) => {
        await new Promise(r => setTimeout(r, 300));
        return getProductsByCategory(category);
    },

    // Get featured products for home page
    getFeaturedProducts: async () => {
        await new Promise(r => setTimeout(r, 200));
        return getFeaturedProducts();
    },

    // Get reviews for a product
    getProductReviews: async (productId) => {
        await new Promise(r => setTimeout(r, 200));
        return getReviewsForProduct(productId);
    },

    // Chat endpoint: returns assistant message and product suggestions
    sendChatMessage: async (message) => {
        await new Promise(r => setTimeout(r, 700));

        const lower = message.toLowerCase();
        let matched = [];

        // Smart product matching based on keywords
        if (lower.includes('laptop') || lower.includes('computer') || lower.includes('work') || lower.includes('personal')) {
            // Return the featured laptop products
            matched = products.filter(p => p.id === 'p1' || p.id === 'p2' || p.id === 'p3');
        } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('music')) {
            matched = products.filter(p => p.category === 'Electronics' && p.title.toLowerCase().includes('speaker'));
        } else if (lower.includes('watch') || lower.includes('fitness') || lower.includes('health')) {
            matched = products.filter(p => p.title.toLowerCase().includes('watch'));
        } else if (lower.includes('shoe') || lower.includes('running') || lower.includes('sport')) {
            matched = products.filter(p => p.id === 'p6' || p.id === 'p12');
        } else if (lower.includes('cloth') || lower.includes('shirt') || lower.includes('fashion')) {
            matched = products.filter(p => p.category === 'Fashion');
        } else if (lower.includes('home') || lower.includes('kitchen') || lower.includes('decor')) {
            matched = products.filter(p => p.category === 'Home');
        } else if (lower.includes('electronic') || lower.includes('tech') || lower.includes('gadget')) {
            matched = products.filter(p => p.category === 'Electronics');
        } else {
            // Default: show featured products
            matched = getFeaturedProducts();
        }

        const suggest = matched.length ? matched.slice(0, 3) : products.slice(0, 3);

        return {
            assistantText: matched.length
                ? `Great! I can help with that. Here are a few options that might suit your needs:`
                : `Here are some popular products you might like:`,
            products: suggest
        };
    },

    // User authentication (mock)
    login: async (email) => {
        await new Promise(r => setTimeout(r, 500));
        // Mock successful login
        return {
            success: true,
            user: {
                id: 'u1',
                name: 'John Doe',
                email: email
            }
        };
    },

    // Create account (mock)
    createAccount: async (name, email) => {
        await new Promise(r => setTimeout(r, 500));
        return {
            success: true,
            user: {
                id: 'u1',
                name: name,
                email: email
            }
        };
    },

    // Reset password (mock)
    resetPassword: async () => {
        await new Promise(r => setTimeout(r, 500));
        return {
            success: true,
            message: 'Password reset link sent to your email'
        };
    }
};

