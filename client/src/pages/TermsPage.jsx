import { motion } from 'framer-motion';

const TermsPage = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using ShopSmart's website, mobile applications, and services, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and others who access or use our services.`,
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
      content: `Our AI shopping assistant provides personalized product recommendations based on your interactions and preferences. By using the AI assistant, you understand that:

• Recommendations are generated algorithmically and may not always be perfect
• The AI may ask questions to better understand your needs
• Your conversations may be used to improve our services
• You should verify product details before making purchases
• The AI assistant is not a substitute for professional advice`,
    },
    {
      title: 'Products and Purchases',
      content: `When making purchases through ShopSmart:

• All prices are displayed in USD unless otherwise noted
• Prices and availability are subject to change without notice
• We reserve the right to limit quantities
• Payment must be received before order processing
• You are responsible for any applicable taxes
• Product images are for illustration purposes only

We make every effort to display accurate product information, but we do not warrant that descriptions or other content is accurate, complete, or error-free.`,
    },
    {
      title: 'Shipping and Delivery',
      content: `Shipping terms:

• Delivery times are estimates and not guaranteed
• Risk of loss passes to you upon delivery to the carrier
• We are not responsible for delays caused by carriers
• International orders may be subject to customs fees
• Some items may have shipping restrictions

Please review our Shipping Policy for detailed information.`,
    },
    {
      title: 'Returns and Refunds',
      content: `Our return policy:

• Most items can be returned within 30 days of delivery
• Items must be in original condition with tags attached
• Some items (personalized, perishable) may not be returnable
• Refunds are processed within 5-10 business days
• Original shipping costs are non-refundable unless we made an error

See our Returns Policy for complete details.`,
    },
    {
      title: 'Intellectual Property',
      content: `All content on ShopSmart, including but not limited to:

• Website design and layout
• Logos, trademarks, and brand elements
• Product descriptions and images
• AI algorithms and technology
• Software and code

is the property of ShopSmart or its licensors and is protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.`,
    },
    {
      title: 'User Conduct',
      content: `You agree not to:

• Use our services for any illegal purpose
• Harass, abuse, or harm other users
• Attempt to gain unauthorized access to our systems
• Use automated systems to access our services without permission
• Interfere with the proper working of our services
• Upload malicious code or content
• Impersonate others or provide false information
• Violate any applicable laws or regulations`,
    },
    {
      title: 'Limitation of Liability',
      content: `To the maximum extent permitted by law:

• ShopSmart is provided "as is" without warranties of any kind
• We are not liable for indirect, incidental, or consequential damages
• Our total liability is limited to the amount you paid for the service
• We do not guarantee uninterrupted or error-free service
• We are not responsible for third-party content or links

Some jurisdictions do not allow these limitations, so they may not apply to you.`,
    },
    {
      title: 'Modifications to Terms',
      content: `We may modify these terms at any time by posting the revised terms on our website. Your continued use of our services after changes are posted constitutes your acceptance of the modified terms.

We will notify you of material changes via email or through our services. Please review these terms periodically.`,
    },
    {
      title: 'Governing Law',
      content: `These terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved in the courts of Delaware.

You agree to submit to the personal jurisdiction of these courts.`,
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-lg text-blue-100">
              Please read these terms carefully before using our services.
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
                  Welcome to ShopSmart. These Terms of Service ("Terms") govern your use 
                  of our website, mobile applications, AI shopping assistant, and related 
                  services (collectively, the "Services"). By using our Services, you agree 
                  to these Terms.
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
                    legal@shopsmart.com<br />
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

export default TermsPage;
