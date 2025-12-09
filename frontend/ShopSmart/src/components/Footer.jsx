import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Footer Links */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 mb-6">
                    <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                        About Us
                    </Link>
                    <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                        Contact
                    </Link>
                    <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                        Privacy Policy
                    </Link>
                    <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                        Terms of Service
                    </Link>
                </div>

                {/* Copyright Text */}
                <div className="text-center border-t border-gray-200 pt-6">
                    <p className="text-gray-600 text-sm">
                        &copy;{new Date().getFullYear()} ShopSmart. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
