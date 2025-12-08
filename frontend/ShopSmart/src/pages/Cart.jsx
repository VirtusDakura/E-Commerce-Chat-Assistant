import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import Button from "../components/Button";

export default function Cart() {
    const { items, updateQty, clear } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Shopping Cart | ShopSmart";
    }, []);

    const handleCheckout = () => {
        alert("Order placed successfully! Thank you for shopping with ShopSmart.");
        clear();
        navigate("/");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
                <div className="max-w-xl w-full">
                    {/* Empty Cart Card */}
                    <div className="bg-white rounded-2xl p-10 md:p-16 text-center border border-gray-200 shadow-lg">
                        {/* Title - NOW ABOVE IMAGE */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                            Your cart is empty
                        </h2>

                        {/* Cart Image with Orange Background - EXTRA LARGE */}
                        <div className="w-full h-72 md:h-96 mb-10 bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl flex items-center justify-center">
                            <img
                                src="/src/assets/empty-cart.png"
                                alt="Empty cart"
                                className="w-64 h-64 md:w-80 md:h-80 object-contain"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-base md:text-lg text-gray-600 mb-16 leading-relaxed px-4">
                            Looks like you haven't added anything to your cart yet. Start exploring our products and fill it up with amazing items!
                        </p>

                        {/* Button */}
                        <Link
                            to="/"
                            className="inline-block px-10 py-4 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                    {/* Cart Items */}
                    <div className="space-y-6 mb-8">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                                {/* Product Image */}
                                <Link to={`/product/${item.id}`} className="w-16 h-16 flex-shrink-0 bg-orange-100 rounded-lg overflow-hidden p-2">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1">
                                    <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 hover:text-blue-600 mb-1 block">
                                        {item.title}
                                    </Link>
                                    {item.category && (
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1 border border-gray-200">
                                    <button
                                        onClick={() => updateQty(item.id, Math.max(1, (item.qty || 1) - 1))}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors text-gray-700"
                                    >
                                        −
                                    </button>
                                    <span className="min-w-[2rem] text-center font-semibold text-gray-900">
                                        {item.qty || 1}
                                    </span>
                                    <button
                                        onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors text-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping</span>
                                <span className="font-semibold text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Taxes</span>
                                <span className="font-semibold">${(subtotal * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total</span>
                                <span>${(subtotal + subtotal * 0.1).toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full"
                            size="lg"
                        >
                            Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
