import React from "react";
import Button from "../components/Button";

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-lg text-blue-100 max-w-2xl">
                        Please read these terms and conditions carefully before using ShopSmart.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Acceptance of Terms</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            By accessing and using ShopSmart, you accept and agree to be bound by the terms and provision of this agreement. 
                            If you do not agree to abide by the above, please do not use this service.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Use License</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Permission is granted to temporarily download one copy of the materials (information or software) on ShopSmart's website 
                            for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under 
                            this license you may not:
                        </p>
                        <ul className="text-gray-600 space-y-2 mb-8 list-disc list-inside">
                            <li>Modifying or copying the materials</li>
                            <li>Using the materials for any commercial purpose or for any public display</li>
                            <li>Attempting to decompile or reverse engineer any software contained on ShopSmart's website</li>
                            <li>Removing any copyright or other proprietary notations from the materials</li>
                            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                        </ul>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Disclaimer</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            The materials on ShopSmart's website are provided "as is". ShopSmart makes no warranties, expressed or implied, and hereby 
                            disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
                            fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Limitations</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            In no event shall ShopSmart or its suppliers be liable for any damages (including, without limitation, damages for loss of data 
                            or profit, or due to business interruption) arising out of the use or inability to use the materials on ShopSmart's website, 
                            even if ShopSmart or a ShopSmart authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Accuracy of Materials</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            The materials appearing on ShopSmart's website could include technical, typographical, or photographic errors. ShopSmart does not 
                            warrant that any of the materials on its website are accurate, complete, or current. ShopSmart may make changes to the materials 
                            contained on its website at any time without notice.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Links</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            ShopSmart has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. 
                            The inclusion of any link does not imply endorsement by ShopSmart of the site. Use of any such linked website is at the user's own risk.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Modifications</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            ShopSmart may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to 
                            be bound by the then current version of these terms of service.
                        </p>

                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Governing Law</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            These terms and conditions are governed by and construed in accordance with the laws of Ghana, and you irrevocably submit to the 
                            exclusive jurisdiction of the courts in that location.
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
