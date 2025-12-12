import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const ProductImageGallery = ({ images = [], productName = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fallback to placeholder if no images
  const displayImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={displayImages[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Image Navigation */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) =>
                prev === 0 ? displayImages.length - 1 : prev - 1
              )}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedIndex((prev) =>
                prev === displayImages.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all',
                selectedIndex === index
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-transparent hover:border-gray-300'
              )}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
