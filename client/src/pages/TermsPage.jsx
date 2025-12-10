import { motion } from 'framer-motion';

const TermsPage = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using ShopSmart AI's website and services, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and others who access or use our AI shopping assistant service.`,
    },
    {
      title: 'Account Registration',
      content: `To use certain features of our services, you must register for an account. When you register, you agree to:

• Provide accurate, current, and complete information
• Maintain and promptly update your account information
• Keep your password secure and confidential
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use

We reserve the right to suspend or terminate accounts that violate these terms.`,
    },
    {
      title: 'AI Shopping Assistant',
      content: `Our AI shopping assistant, powered by Google Gemini, provides product recommendations from Jumia Ghana based on your conversations. By using the AI assistant, you understand that:

• Recommendations are generated algorithmically and may not always be perfect
• Product information is sourced from Jumia Ghana and may change
• Prices shown are in Ghana Cedis (GHS) and are subject to change
• You should verify product details on Jumia Ghana before purchasing
• The AI assistant provides shopping help, not professional advice`,
    },
    {
      title: 'Products and Purchases',
      content: `ShopSmart AI is a shopping assistant that helps you discover products on Jumia Ghana. Important notes:

• All purchases are made directly on Jumia Ghana's platform
• All prices are displayed in GHS (Ghana Cedis)
• Prices and availability are controlled by Jumia Ghana and subject to change
• ShopSmart AI does not process payments or handle transactions
• Product images and descriptions are sourced from Jumia Ghana
• For purchase-related issues, please contact Jumia Ghana directly

We strive to provide accurate product information but cannot guarantee that all details are current or error-free.`,
    },
    {
      title: 'Third-Party Services',
      content: `ShopSmart AI integrates with third-party services:

• Jumia Ghana: Product information, pricing, and purchases
• Google Gemini AI: Conversation processing and recommendations

When you click to purchase a product, you will be redirected to Jumia Ghana. Your interactions with Jumia Ghana are governed by their terms of service and privacy policy. We encourage you to review their policies.`,
    },
    {
      title: 'Cart and Wishlist Features',
      content: `ShopSmart AI allows you to save products to your cart and wishlist:

• These features are for convenience and do not represent actual purchases
• Saved items may become unavailable or change price on Jumia Ghana
• Your cart and wishlist data is stored in your account
• We are not responsible for product availability when you decide to purchase`,
    },
    {
      title: 'Intellectual Property',
      content: `All content on ShopSmart AI, including but not limited to:

• Website design and layout
• Logos, trademarks, and brand elements
• AI algorithms and technology
• Software and code

is the property of ShopSmart AI or its licensors and is protected by intellectual property laws. Product information and images are the property of Jumia Ghana and their respective owners.`,
    },
    {
      title: 'User Conduct',
      content: `You agree not to:

• Use our services for any illegal purpose
• Attempt to gain unauthorized access to our systems
• Use automated systems to scrape or abuse our services
• Interfere with the proper working of our services
• Upload malicious code or content
• Impersonate others or provide false information
• Violate any applicable laws or regulations`,
    },
    {
      title: 'Limitation of Liability',
      content: `To the maximum extent permitted by law:

• ShopSmart AI is provided "as is" without warranties of any kind
• We are not liable for indirect, incidental, or consequential damages
• We do not guarantee uninterrupted or error-free service
• We are not responsible for purchases made on Jumia Ghana
• We are not responsible for third-party content or services

ShopSmart AI is a free service that helps you discover products. All purchasing decisions and transactions are between you and Jumia Ghana.`,
    },
    {
      title: 'Modifications to Terms',
      content: `We may modify these terms at any time by posting the revised terms on our website. Your continued use of our services after changes are posted constitutes your acceptance of the modified terms.

Please review these terms periodically for any updates.`,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-lg text-blue-100">
              Please read these terms carefully before using ShopSmart AI.
            </p>
            <p className="text-sm text-blue-200 mt-4">Last Updated: December 1, 2024</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-8">
                  Welcome to ShopSmart AI. These Terms of Service ("Terms") govern your use 
                  of our AI shopping assistant service that helps you discover products on 
                  Jumia Ghana. By using our Services, you agree to these Terms.
                </p>

                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      {index + 1}. {section.title}
                    </h2>
                    <div className="text-gray-600 whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}

                <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Contact Us
                  </h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <p className="text-blue-600">
                    support@shopsmartai.com
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
