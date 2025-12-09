import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import Button from "../components/Button";

export default function Home() {
    const [showAllCategories, setShowAllCategories] = useState(false);

    useEffect(() => {
        document.title = "Home | ShopSmart";
    }, []);

    // Hero image
    const heroImage = new URL('../assets/Hero.png', import.meta.url).href;

    // Category data with images from assets
    const allCategories = [
        {
            id: 1,
            name: 'Electronics',
            image: new URL('../assets/Electronics.png', import.meta.url).href,
            link: '/chat'
        },
        {
            id: 2,
            name: 'Fashion',
            image: new URL('../assets/Fashion.png', import.meta.url).href,
            link: '/chat'
        },
        {
            id: 3,
            name: 'Home & Garden',
            image: new URL('../assets/Home $ Garden.png', import.meta.url).href,
            link: '/chat'
        },
        {
            id: 4,
            name: 'Books',
            image: new URL('../assets/Books.png', import.meta.url).href,
            link: '/chat'
        },
        {
            id: 5,
            name: 'Sports & Outdoors',
            image: new URL('../assets/image copy 6.png', import.meta.url).href,
            link: '/chat'
        },
        {
            id: 6,
            name: 'Beauty & Personal Care',
            image: new URL('../assets/image copy 7.png', import.meta.url).href,
            link: '/chat'
        },
        {
            id: 7,
            name: 'Toys & Games',
            image: new URL('../assets/image copy 8.png', import.meta.url).href,
            link: '/chat'
        },
        {
            id: 8,
            name: 'Automotive',
            image: new URL('../assets/image copy 9.png', import.meta.url).href,
            link: '/chat'
        }
    ];

    // Show only 4 categories initially, all if showAllCategories is true
    const categoriesToDisplay = showAllCategories ? allCategories : allCategories.slice(0, 4);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Full-Width Image */}
            <section className="relative bg-white overflow-hidden pt-0 pb-0">
                <div className="relative w-full h-screen md:h-[600px]">
                    <img
                        src={heroImage}
                        alt="Shopping with AI"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="text-center text-white px-4 sm:px-6 space-y-4 md:space-y-6 max-w-2xl">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Shop With <br />
                                <span className="text-blue-400">AI Intelligence</span>
                            </h1>
                            <p className="text-base md:text-lg lg:text-xl text-gray-100 max-w-lg mx-auto leading-relaxed">
                                Your personal shopping assistant is here to help you find the perfect products.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center">
                                <Button
                                    to="/chat"
                                    size="lg"
                                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-md px-16 py-6 rounded-2xl flex flex-col items-center justify-center"
                                >
                                    <svg className="w-7 h-7 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="text-lg font-semibold">Start Chatting</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="py-12 md:py-16 bg-white border-t border-b border-gray-100 mb-24 md:mb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Categories</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {categoriesToDisplay.map((category) => (
                            <Link
                                key={category.id}
                                to={category.link}
                                className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-square"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm md:text-base text-center px-4">
                                        {category.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View More / View Less Button */}
                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            variant="outline"
                            size="lg"
                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white w-40 h-40 rounded-2xl flex flex-col items-center justify-center"
                        >
                            {showAllCategories ? (
                                <>
                                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    <span className="text-lg font-semibold">View Less</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    <span className="text-lg font-semibold">View More</span>
                                    <span className="text-sm">+{allCategories.length - 4}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

