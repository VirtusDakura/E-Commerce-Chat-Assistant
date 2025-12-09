import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { avatars } from "../utils/chatAssets";

export default function ChatBubble({ message }) {
    const isUser = message.role === "user";
    const addToCart = useCartStore(state => state.addItem);

    return (
        <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} mb-6`}>
            {/* AI Avatar - Left side */}
            {!isUser && (
                <div className="flex-shrink-0">
                    <img src={avatars.ai} alt="AI Assistant" className="w-10 h-10 rounded-full object-cover" />
                </div>
            )}

            <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
                {/* AI Label */}
                {!isUser && (
                    <div className="text-xs text-gray-500 mb-1 font-medium">AI Assistant</div>
                )}

                <div className={`rounded-2xl p-4 ${isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                    }`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.text}</p>

                    {/* Product Suggestions in Chat */}
                    {message.products && message.products.length > 0 && (
                        <div className={`mt-4 grid gap-4 ${message.products.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {message.products.map(product => (
                                <div key={product.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                                    <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden aspect-square">
                                        {product.image ? (
                                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{product.title}</h4>
                                    <p className="text-xs text-gray-600 mb-2">
                                        {product.specifications ? Object.values(product.specifications).slice(0, 1).join(', ') : ''}
                                    </p>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full text-sm py-2 px-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg border border-gray-300 font-medium"
                                        >
                                            Add to Cart +
                                        </button>
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="w-full text-sm py-2 px-3 text-center block text-blue-600 hover:bg-blue-50 transition-colors rounded-lg border border-blue-300 font-medium"
                                        >
                                            More Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* User Avatar - Right side */}
            {isUser && (
                <div className="flex-shrink-0">
                    <img src={avatars.user} alt="User" className="w-10 h-10 rounded-full object-cover" />
                </div>
            )}
        </div>
    );
}
