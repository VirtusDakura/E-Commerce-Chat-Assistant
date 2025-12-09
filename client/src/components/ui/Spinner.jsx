import { cn } from '../../lib/utils';

const Spinner = ({ size = 'md', className, ...props }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 border-t-blue-600',
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" className="mx-auto" />
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

const LoadingCard = ({ className }) => (
  <div className={cn('bg-white rounded-xl p-6 animate-pulse', className)}>
    <div className="h-48 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

const LoadingText = ({ lines = 3, className }) => (
  <div className={cn('animate-pulse space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-4 bg-gray-200 rounded',
          i === lines - 1 && 'w-3/4'
        )}
      />
    ))}
  </div>
);

Spinner.Overlay = LoadingOverlay;
Spinner.Card = LoadingCard;
Spinner.Text = LoadingText;

export default Spinner;
