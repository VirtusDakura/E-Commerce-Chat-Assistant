import React from "react";
import Button from "../components/Button";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-lg text-blue-100 max-w-2xl">
                        Your privacy is important to us. Please read our privacy policy carefully.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Introduction</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            ShopSmart ("we", "us", "our") operates the ShopSmart website. This page informs you of our policies 
                            regarding the collection, use, and disclosure of personal data when you use our service and the choices 
                            you have associated with that data.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Information Collection and Use</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            We collect several different types of information for various purposes to provide and improve our service to you.
                        </p>
                        <ul className="text-gray-600 space-y-2 mb-8 list-disc list-inside">
                            <li>Personal data (email, name, contact information)</li>
                            <li>Usage data (pages visited, time spent, referring URL)</li>
                            <li>Device information (IP address, browser type, operating system)</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Use of Data</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            ShopSmart uses the collected data for various purposes:
                        </p>
                        <ul className="text-gray-600 space-y-2 mb-8 list-disc list-inside">
                            <li>To provide and maintain our service</li>
                            <li>To notify you about changes to our service</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis and valuable information to improve our service</li>
                            <li>To monitor the usage of our service</li>
                            <li>To detect, prevent and address technical issues</li>
                        </ul>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Security of Data</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            The security of your data is important to us, but remember that no method of transmission over the Internet 
                            or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
                            your personal data, we cannot guarantee its absolute security.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Changes to This Privacy Policy</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
                            Policy on this page and updating the "effective date" at the top of this Privacy Policy.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h2>
                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-gray-600 mt-4">
                            Email: <a href="mailto:privacy@shopsmart.com" className="text-blue-600 hover:text-blue-700">privacy@shopsmart.com</a>
                        </p>
                    </div>

                    <div className="mt-12 text-center">
                        <Button to="/" size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                            Back to Home
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
