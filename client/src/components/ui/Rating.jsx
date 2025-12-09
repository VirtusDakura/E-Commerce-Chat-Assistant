import { FiStar } from 'react-icons/fi';
import { cn } from '../../lib/utils';

const Rating = ({
  value = 0,
  max = 5,
  size = 'md',
  showValue = false,
  count,
  interactive = false,
  onChange,
  className,
}) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const handleClick = (rating) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= value;
          const isHalf = !isFilled && starValue - 0.5 <= value;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              className={cn(
                'relative focus:outline-none',
                interactive && 'cursor-pointer hover:scale-110 transition-transform',
                !interactive && 'cursor-default'
              )}
              disabled={!interactive}
            >
              {/* Background star */}
              <FiStar
                className={cn(sizes[size], 'text-gray-300')}
                fill="currentColor"
              />
              {/* Filled star */}
              {(isFilled || isHalf) && (
                <FiStar
                  className={cn(
                    sizes[size],
                    'text-yellow-400 absolute top-0 left-0',
                    isHalf && 'clip-half'
                  )}
                  fill="currentColor"
                  style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
};

export default Rating;
