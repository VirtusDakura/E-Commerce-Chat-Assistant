import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useUserStore } from "../store/userStore";
import Button from "./Button";

export default function Navbar() {
    const items = useCartStore(state => state.items);
    const wishlistItems = useWishlistStore(state => state.items);
    const user = useUserStore(state => state.user);
    const location = useLocation();

    const cartCount = items.reduce((total, item) => total + (item.qty || 1), 0);
    const wishlistCount = wishlistItems.length;

    const isAuthPage = ['/login', '/create-account', '/forgot-password'].includes(location.pathname);

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-lg md:text-xl font-bold text-gray-900 tracking-tight hidden sm:inline">ShopSmart</span>
                    </Link>

                    {/* Right Side Navigation and Actions */}
                    <div className="flex items-center justify-end gap-6 md:gap-8">
                        {!isAuthPage && (
                            <>
                                {/* Navigation Links */}
                                <div className="hidden md:flex items-center gap-6">
                                    <Link
                                        to="/"
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm"
                                    >
                                        Contact
                                    </Link>

                                    {/* Cart Icon */}
                                    <Link
                                        to="/cart"
                                        className="relative text-gray-600 hover:text-blue-600 transition-colors"
                                        title="Shopping Cart"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Wishlist Icon */}
                                    <Link
                                        to="/wishlist"
                                        className="relative text-gray-600 hover:text-red-500 transition-colors"
                                        title="Wishlist"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        {wishlistCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {/* User */}
                                {user ? (
                                    <div className="flex items-center space-x-2 pl-4 md:pl-6 border-l border-gray-200">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 flex-shrink-0">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[100px]">
                                            {user.name}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-gray-200">
                                        <Button
                                            to="/login"
                                            size="sm"
                                            className="text-sm shadow-none border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            to="/create-account"
                                            size="sm"
                                            className="text-sm shadow-none bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            Sign Up
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {isAuthPage && (
                            <div className="flex items-center gap-3">
                                {location.pathname === '/create-account' ? (
                                    <Button
                                        to="/login"
                                        size="sm"
                                        className="text-sm shadow-none bg-gray-100 text-gray-900 hover:bg-gray-200 font-semibold"
                                    >
                                        Log In
                                    </Button>
                                ) : (
                                    <Button
                                        to="/create-account"
                                        size="sm"
                                        className="text-sm shadow-none bg-gray-100 text-gray-900 hover:bg-gray-200 font-semibold"
                                    >
                                        Sign Up
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

