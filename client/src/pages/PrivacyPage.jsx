import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account or use our AI shopping assistant. This may include:

• Personal information (name, email address)
• Account credentials
• Chat history and conversation data with our AI assistant
• Shopping preferences and interests
• Products you search for, save, or add to your cart
• Any other information you choose to provide`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:

• Provide personalized AI-powered product recommendations
• Process your shopping queries and requests
• Save your cart and wishlist items
• Send you technical notices and support messages
• Respond to your comments, questions, and requests
• Improve our AI models to better serve you
• Monitor and analyze usage patterns to enhance our service`,
    },
    {
      title: 'AI and Data Processing',
      content: `Our AI shopping assistant, powered by Google Gemini, processes your conversations to provide helpful product recommendations from Jumia Ghana. This processing includes:

• Understanding your shopping queries and preferences
• Searching for relevant products on Jumia Ghana
• Generating personalized product suggestions
• Improving our AI responses over time
• Your chat conversations may be used to improve our AI service`,
    },
    {
      title: 'Third-Party Services',
      content: `ShopSmart AI integrates with third-party services to provide our functionality:

• Google Gemini AI for conversation processing
• Jumia Ghana for product information and purchases
• Analytics providers to improve our services

When you click to purchase a product, you will be redirected to Jumia Ghana, which has its own privacy policy. We encourage you to review their policies.`,
    },
    {
      title: 'Data Security',
      content: `We implement security measures to protect your information:

• Encryption of data in transit
• Secure authentication using JWT tokens
• Password hashing for account security
• Regular security reviews
• Access controls on sensitive data`,
    },
    {
      title: 'Your Rights',
      content: `You have the right to:

• Access your personal data
• Correct inaccurate data
• Delete your account and data
• Clear your chat history
• Opt out of marketing communications

To exercise these rights, contact us at privacy@shopsmartai.com`,
    },
    {
      title: 'Cookies and Local Storage',
      content: `We use cookies and local storage to:

• Keep you logged in
• Remember your cart and wishlist items
• Save your preferences
• Understand how you use our service
• Improve our services

You can manage these through your browser settings.`,
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.`,
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-lg text-blue-100">
              Your privacy matters to us. This policy explains how ShopSmart AI 
              collects, uses, and protects your personal information.
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
                  At ShopSmart AI, we take your privacy seriously. This Privacy Policy 
                  describes how we collect, use, and share information about you when 
                  you use our AI shopping assistant service that helps you find products 
                  on Jumia Ghana.
                </p>

                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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

                <div className="mt-12 p-6 bg-blue-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Questions About Privacy?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, 
                    please contact us at:
                  </p>
                  <p className="text-blue-600">
                    privacy@shopsmartai.com
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

export default PrivacyPage;
