import React from "react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

export default function Wishlist() {
    const { items, remove } = useWishlistStore();
    const addToCart = useCartStore(state => state.addItem);

    React.useEffect(() => {
        document.title = "My Wishlist | ShopSmart";
    }, []);

    if (items.length === 0) {
        return (
            <EmptyState
                title="Your wishlist is empty"
                message="Save items you love for later"
                icon="heart"
                actionText="Start Shopping"
                actionLink="/"
            />
        );
    }

    const handleAddToCart = (product) => {
        addToCart(product);
        remove(product.id);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 animate-fade-in-down">My Wishlist</h1>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                    <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <div key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 hover:bg-gray-50 transition-colors group">
                                {/* Product Image */}
                                <Link to={`/product/${item.id}`} className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden p-2 border border-gray-200">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/product/${item.id}`} className="text-base md:text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate">
                                                {item.title}
                                            </Link>
                                            {item.category && (
                                                <p className="text-xs md:text-sm text-gray-500 mt-1">{item.category}</p>
                                            )}
                                        </div>
                                        <div className="text-lg md:text-xl font-bold text-blue-600 flex-shrink-0">
                                            GHS {item.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'fill-yellow-400' : 'fill-gray-300'}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                        <span className="text-xs md:text-sm text-gray-600 font-semibold ml-1">{item.rating}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                                        <Button
                                            onClick={() => handleAddToCart(item)}
                                            size="sm"
                                            className="text-sm shadow-sm"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Add to Cart
                                        </Button>
                                        <Button
                                            onClick={() => remove(item.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-sm"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
