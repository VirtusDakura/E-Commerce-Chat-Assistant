import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiSend, FiMessageCircle, FiClock } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

const contactInfo = [
  {
    icon: FiMail,
    title: 'Email',
    value: 'support@shopsmartai.com',
    description: 'We respond within 24 hours',
  },
  {
    icon: FiMessageCircle,
    title: 'AI Chat',
    value: 'Always Available',
    description: 'Chat with our AI assistant 24/7',
  },
  {
    icon: FiMapPin,
    title: 'Location',
    value: 'Accra, Ghana',
    description: 'Serving shoppers across Ghana',
  },
  {
    icon: FiClock,
    title: 'Support Hours',
    value: '24/7 AI Support',
    description: 'Human support: 9am-6pm GMT',
  },
];

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form submitted:', data);
    setIsLoading(false);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Get in Touch</h1>
            <p className="text-lg text-blue-100">
              Have questions about ShopSmart AI? Need help with your shopping experience?
              We're here to help you find the best deals on Jumia Ghana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                  <p className="text-blue-600 font-medium mb-1">{info.value}</p>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {isSubmitted && (
                <Alert variant="success" className="mb-6">
                  Thank you for your message! We'll get back to you shortly.
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Your Name"
                    placeholder="John Doe"
                    error={errors.name?.message}
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  error={errors.subject?.message}
                  {...register('subject', {
                    required: 'Subject is required',
                    minLength: { value: 5, message: 'Subject must be at least 5 characters' },
                  })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 20, message: 'Message must be at least 20 characters' },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  leftIcon={<FiSend className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Map/Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Quick Contact Options */}
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Need Immediate Help?
                </h3>
                <p className="text-gray-600 mb-4">
                  Our AI assistant is available 24/7 to help you with your shopping needs.
                </p>
                <Button
                  variant="primary"
                  leftIcon={<FiMessageCircle className="w-5 h-5" />}
                  onClick={() => window.location.href = '/chat'}
                >
                  Chat with AI Assistant
                </Button>
              </Card>

              {/* FAQ Teaser */}
              <Card variant="filled" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {[
                    'How does the AI shopping assistant work?',
                    'Are the products from Jumia Ghana?',
                    'Can I purchase directly through ShopSmart AI?',
                    'How accurate are the product prices?',
                  ].map((question, index) => (
                    <button
                      key={index}
                      className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      → {question}
                    </button>
                  ))}
                </div>
              </Card>

              {/* About ShopSmart AI */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About ShopSmart AI
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ShopSmart AI is your intelligent shopping assistant for Jumia Ghana.
                  Powered by Google Gemini AI, we help you discover products, compare prices,
                  and find the best deals through natural conversation. When you're ready to
                  purchase, we'll direct you straight to Jumia Ghana to complete your order.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
