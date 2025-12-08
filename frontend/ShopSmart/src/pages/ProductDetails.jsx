import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockApi } from "../utils/api";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import Button from "../components/Button";
import Loader from "../components/Loader";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const addToCart = useCartStore(state => state.addItem);
    const addToWishlist = useWishlistStore(state => state.add);
    const wishlistItems = useWishlistStore(state => state.items);

    const isInWishlist = wishlistItems.some(item => item.id === id);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const [productData, reviewsData] = await Promise.all([
                    mockApi.getProductById(id),
                    mockApi.getProductReviews(id)
                ]);
                setProduct(productData);
                setReviews(reviewsData);
                if (productData) {
                    document.title = `${productData.title} | ShopSmart`;
                }
                setLoading(false);
            } catch (error) {
                console.error("Error loading product:", error);
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader size="xl" className="mb-4" />
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                    <Button to="/" variant="ghost">Go back home</Button>
                </div>
            </div>
        );
    }

    const images = product.images || [product.image];

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'fill-yellow-400' : 'fill-gray-300'}`}
                viewBox="0 0 20 20"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 md:mb-8 flex items-center gap-2 text-xs md:text-sm text-gray-600 animate-fade-in-down">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-medium truncate">{product.title}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 animate-fade-in-up">
                    {/* Product Images Section */}
                    <div className="space-y-3 md:space-y-4">
                        {/* Main Image */}
                        <div className="bg-white rounded-xl p-4 md:p-8 aspect-square flex items-center justify-center shadow-sm border border-gray-100 relative overflow-hidden group">
                            {images[selectedImage] ? (
                                <img
                                    src={images[selectedImage]}
                                    alt={product.title}
                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center justify-center">
                                    <svg className="w-24 h-24 md:w-32 md:h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm mt-2">No image available</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 md:gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`bg-white rounded-lg p-2 aspect-square border-2 transition-all overflow-hidden group ${selectedImage === idx
                                            ? 'border-blue-600 shadow-md scale-100'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {img ? (
                                            <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-300">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col">
                        {/* Title & Category */}
                        <div className="mb-4 md:mb-6">
                            {product.category && (
                                <p className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
                                    {product.category}
                                </p>
                            )}
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
                            <div className="flex items-center gap-0.5">
                                {renderStars(product.rating)}
                            </div>
                            <span className="font-bold text-gray-900 text-lg">{product.rating}</span>
                            <span className="text-gray-500 text-sm font-medium">
                                ({product.reviewCount || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">Price</p>
                            <div className="text-3xl md:text-4xl font-bold text-blue-600">
                                {product.currency} {product.price.toFixed(2)}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">About This Product</h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {product.description}
                            </p>
                        </div>

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-start">
                                            <span className="text-gray-600 font-medium text-sm">{key}</span>
                                            <span className="text-gray-900 font-semibold text-sm text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6">
                            <Button
                                onClick={() => addToCart(product)}
                                size="lg"
                                className="flex-1 gap-2 shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </Button>
                            <Button
                                onClick={() => isInWishlist ? useWishlistStore.getState().remove(id) : addToWishlist(product)}
                                variant={isInWishlist ? "danger" : "outline"}
                                size="lg"
                                className={`px-6 transition-colors ${isInWishlist
                                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                    : "hover:bg-blue-50 hover:border-blue-300"
                                    }`}
                            >
                                <svg className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {reviews && reviews.length > 0 && (
                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Customer Reviews</h2>
                        <div className="space-y-6 md:space-y-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-6 md:pb-8 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-4 gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                                                {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-gray-900 text-sm md:text-base truncate">
                                                    {review.userName || 'Anonymous'}
                                                </div>
                                                <div className="text-xs md:text-sm text-gray-500">
                                                    {new Date(review.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5 flex-shrink-0">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    {review.title && (
                                        <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{review.title}</h4>
                                    )}
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                                        {review.comment}
                                    </p>
                                    {review.helpful !== undefined && (
                                        <button className="text-xs md:text-sm text-gray-500 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                            Helpful ({review.helpful})
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
