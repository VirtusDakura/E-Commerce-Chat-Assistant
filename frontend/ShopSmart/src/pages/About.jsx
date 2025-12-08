import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About ShopSmart</h1>
                    <p className="text-lg text-blue-100 max-w-2xl">
                        Revolutionizing the way people shop with AI-powered assistance and premium products.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            At ShopSmart, we believe that shopping should be intelligent, personalized, and effortless. 
                            Our mission is to leverage cutting-edge AI technology to help customers discover products that 
                            perfectly match their needs and preferences.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Who We Are</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            ShopSmart is a modern e-commerce platform that combines the power of artificial intelligence 
                            with a curated selection of high-quality products. Our team is dedicated to creating an intuitive 
                            shopping experience that saves you time and helps you make informed purchasing decisions.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Values</h2>
                        <ul className="text-gray-600 space-y-4 mb-8">
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span><strong>Quality:</strong> We carefully select every product to ensure the highest standards.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span><strong>Innovation:</strong> We continuously improve our AI technology to better serve you.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span><strong>Customer First:</strong> Your satisfaction is our top priority.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span><strong>Transparency:</strong> We believe in honest communication and fair pricing.</span>
                            </li>
                        </ul>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Choose ShopSmart?</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            With ShopSmart, you get access to an intelligent shopping assistant that understands your needs, 
                            premium quality products, competitive pricing, and exceptional customer support. We're committed to 
                            making your shopping experience faster, easier, and more enjoyable.
                        </p>
                    </div>

                    <div className="mt-12 text-center">
                        <Button to="/chat" size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                            Start Shopping Now
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
