import { motion } from 'framer-motion';
import { FiUser, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import Rating from '../ui/Rating';
import Avatar from '../ui/Avatar';

const ProductReviews = ({ reviews = [], averageRating = 0, totalReviews = 0 }) => {
  // Sample reviews for demo
  const sampleReviews = reviews.length > 0 ? reviews : [
    {
      id: '1',
      user: { name: 'John Doe', avatar: null },
      rating: 5,
      title: 'Excellent product!',
      content: 'This product exceeded my expectations. The quality is outstanding and it arrived quickly. Would definitely recommend to anyone looking for a reliable option.',
      date: '2024-12-01',
      helpful: 24,
      verified: true,
    },
    {
      id: '2',
      user: { name: 'Sarah Smith', avatar: null },
      rating: 4,
      title: 'Great value for money',
      content: 'Very happy with my purchase. Good quality and fair price. Only giving 4 stars because shipping took a bit longer than expected.',
      date: '2024-11-28',
      helpful: 18,
      verified: true,
    },
    {
      id: '3',
      user: { name: 'Mike Johnson', avatar: null },
      rating: 5,
      title: 'Highly recommend',
      content: 'Perfect! Exactly what I was looking for. The product matches the description and the customer service was excellent.',
      date: '2024-11-25',
      helpful: 12,
      verified: false,
    },
  ];

  const displayReviews = sampleReviews;
  const displayRating = averageRating || 4.5;
  const displayTotal = totalReviews || displayReviews.length;

  // Rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="text-5xl font-bold text-gray-900">
              {displayRating.toFixed(1)}
            </span>
            <div>
              <Rating value={displayRating} size="lg" />
              <p className="text-sm text-gray-500 mt-1">
                Based on {displayTotal} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Bars */}
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{stars} ★</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: 0.1 * stars }}
                  className="h-full bg-yellow-400 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-500 w-10">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        <div className="divide-y divide-gray-100">
          {displayReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="py-6 first:pt-0"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={review.user.name} src={review.user.avatar} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.user.name}
                      </span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Rating value={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              {review.title && (
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              )}
              <p className="text-gray-600 leading-relaxed">{review.content}</p>

              {/* Review Actions */}
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  <FiThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
                  <FiThumbsDown className="w-4 h-4" />
                  Not Helpful
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
