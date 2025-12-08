import React from "react";
import { useChatStore } from "../store/chatStore";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { mockApi } from "../utils/api";
import { useCartStore } from "../store/cartStore";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Chat() {
    const messages = useChatStore(state => state.messages);
    const addMessage = useChatStore(state => state.addMessage);
    const setTyping = useChatStore(state => state.setTyping);
    const typing = useChatStore(state => state.typing);
    const resetChat = useChatStore(state => state.reset);
    const cart = useCartStore();
    const navigate = useNavigate();
    const [compareList, setCompareList] = React.useState([]);

    React.useEffect(() => {
        document.title = "AI Assistant | ShopSmart";
    }, []);

    const send = async (text) => {
        addMessage({ role: "user", text });
        setTyping(true);
        const res = await mockApi.sendChatMessage(text);
        addMessage({ role: "assistant", text: res.assistantText, products: res.products });
        setTyping(false);
    };

    const onAdd = (p) => {
        cart.addItem(p);
    };

    const onCompare = (p) => {
        if (compareList.find(item => item.id === p.id)) {
            setCompareList(compareList.filter(item => item.id !== p.id));
        } else {
            setCompareList([...compareList, p]);
        }
    };

    const viewComparison = () => {
        if (compareList.length >= 2) {
            // Navigate to a comparison view or show modal
            alert(`Comparing: ${compareList.map(p => p.title).join(' vs ')}`);
        } else {
            alert('Please select at least 2 products to compare');
        }
    };

    const handleClearChat = () => {
        if (messages.length > 0) {
            const confirmed = window.confirm('Are you sure you want to clear the chat history?');
            if (confirmed) {
                resetChat();
                setCompareList([]);
            }
        }
    };

    // Get latest assistant products
    const latestProducts = messages.length > 0
        ? messages.filter(m => m.role === "assistant" && m.products).slice(-1)[0]?.products || []
        : [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 text-center relative">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Shopping Assistant</h1>
                    <p className="text-gray-600">Ask me anything about products, and I'll help you find what you need!</p>

                    {/* Clear Chat Button */}
                    {messages.length > 0 && (
                        <button
                            onClick={handleClearChat}
                            className="absolute right-0 top-0 flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-300 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Chat
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chat Window */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}>
                            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                                <ChatWindow messages={messages} />
                                {typing && (
                                    <div className="flex items-center gap-2 text-gray-500 mt-4 animate-fade-in">
                                        <div className="flex gap-1 bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-xs font-medium">Assistant is typing...</span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-gray-200 p-4 bg-white">
                                <ChatInput onSend={send} />

                                {/* Quick Actions */}
                                {latestProducts.length > 0 && (
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-600 font-medium mb-3 pb-2 border-b-2 border-blue-500 inline-block">
                                            Quick Actions
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <button
                                                onClick={() => latestProducts.forEach(p => onAdd(p))}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Add All to Cart
                                            </button>
                                            <button
                                                onClick={viewComparison}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                Compare {compareList.length > 0 && `(${compareList.length})`}
                                            </button>
                                            <button
                                                onClick={() => latestProducts.length > 0 && navigate(`/product/${latestProducts[0].id}`)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Product Details
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Suggestions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" style={{ height: 'calc(100vh - 250px)', minHeight: '500px', overflow: 'auto' }}>
                            <div className="flex items-center gap-2 mb-6">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className="text-lg font-bold text-gray-900">Suggested Products</h3>
                            </div>

                            {latestProducts.length > 0 ? (
                                <div className="space-y-4 animate-fade-in">
                                    {latestProducts.map(p => (
                                        <div key={p.id} className="group border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white">
                                            <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden p-2">
                                                {p.image ? (
                                                    <img src={p.image} alt={p.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">{p.title}</h4>
                                            <div className="text-sm text-gray-600 mb-2">{p.specifications ? Object.values(p.specifications)[0] : ''}</div>
                                            <div className="text-lg font-bold text-blue-600 mb-3">
                                                {p.currency} {p.price.toFixed(2)}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => onAdd(p)}
                                                    size="sm"
                                                    className="flex-1 shadow-sm"
                                                >
                                                    Add
                                                </Button>
                                                <button
                                                    onClick={() => onCompare(p)}
                                                    className={`p-2 border rounded-lg transition-colors ${compareList.find(item => item.id === p.id)
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 text-gray-400'
                                                        }`}
                                                    title="Add to Compare"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-1">No suggestions yet</h4>
                                    <p className="text-sm text-gray-500">Start chatting to get personalized product recommendations!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

