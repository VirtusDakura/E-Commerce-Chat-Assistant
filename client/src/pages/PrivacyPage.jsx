import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:

• Personal information (name, email address, phone number)
• Payment information (credit card details, billing address)
• Shipping information (delivery address)
• Communication preferences
• Any other information you choose to provide`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:

• Process transactions and send related information
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and customer service requests
• Personalize your shopping experience with AI-powered recommendations
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions`,
    },
    {
      title: 'AI and Data Processing',
      content: `Our AI shopping assistant uses your browsing and purchase history to provide personalized recommendations. This processing includes:

• Analyzing your preferences and shopping patterns
• Generating product suggestions based on your interests
• Improving our AI models to better serve you
• You can opt out of AI-based personalization at any time through your account settings`,
    },
    {
      title: 'Information Sharing',
      content: `We may share your information with:

• Service providers who assist in our operations
• Payment processors for transaction handling
• Shipping partners for order delivery
• Analytics providers to improve our services
• Law enforcement when required by law

We never sell your personal information to third parties.`,
    },
    {
      title: 'Data Security',
      content: `We implement industry-standard security measures including:

• Encryption of data in transit and at rest
• Regular security audits and penetration testing
• Access controls and authentication measures
• Secure data centers with 24/7 monitoring
• Employee training on data protection`,
    },
    {
      title: 'Your Rights',
      content: `You have the right to:

• Access your personal data
• Correct inaccurate data
• Delete your data
• Export your data
• Opt out of marketing communications
• Restrict processing of your data

To exercise these rights, contact us at privacy@shopsmart.com`,
    },
    {
      title: 'Cookies and Tracking',
      content: `We use cookies and similar technologies to:

• Keep you logged in
• Remember your preferences
• Understand how you use our site
• Deliver personalized advertisements
• Improve our services

You can manage cookie preferences through your browser settings.`,
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.`,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-lg text-blue-100">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information.
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
                  At ShopSmart, we take your privacy seriously. This Privacy Policy 
                  describes how we collect, use, and share information about you when 
                  you use our website, mobile applications, and other online products 
                  and services.
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
                    privacy@shopsmart.com<br />
                    +1 (555) 123-4567
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
