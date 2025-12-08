import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import Button from "./Button";

export default function ProductCard({ product }) {
    const addToCart = useCartStore(state => state.addItem);
    const addToWishlist = useWishlistStore(state => state.add);
    const wishlistItems = useWishlistStore(state => state.items);

    const isInWishlist = wishlistItems.some(item => item.id === product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        if (isInWishlist) {
            useWishlistStore.getState().remove(product.id);
        } else {
            addToWishlist(product);
        }
    };

    // Render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={`half-${product.id}`}>
                                <stop offset="50%" stopColor="#FBBF24" />
                                <stop offset="50%" stopColor="#E5E7EB" />
                            </linearGradient>
                        </defs>
                        <path fill={`url(#half-${product.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            }
        }
        return stars;
    };

    return (
        <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full hover:translate-y-[-2px]">
            {/* Product Image Container */}
            <Link to={`/product/${product.id}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Wishlist Button - Top Right Corner */}
                <button
                    onClick={handleToggleWishlist}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isInWishlist 
                            ? 'bg-red-500 text-white shadow-lg' 
                            : 'bg-white text-gray-600 shadow-md hover:scale-110'
                    }`}
                    aria-label="Add to wishlist"
                >
                    <svg
                        className={`w-4 h-4 ${isInWishlist ? 'fill-current' : 'fill-none'}`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Badge - Top Left Corner */}
                {product.featured && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        Featured
                    </div>
                )}
            </Link>

            {/* Product Info Section */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                {/* Category & Title */}
                <div className="flex-1">
                    {product.category && (
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1.5">
                            {product.category}
                        </p>
                    )}
                    <Link 
                        to={`/product/${product.id}`}
                        className="block font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors"
                    >
                        {product.title}
                    </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        {renderStars(product.rating)}
                    </div>
                    {product.reviewCount !== undefined && (
                        <span className="text-xs text-gray-500 font-medium">
                            ({product.reviewCount})
                        </span>
                    )}
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <div className="text-lg font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="px-3 py-1.5 rounded-lg text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    );
}
