import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const cardVariants = {
  default: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
  outline: 'bg-transparent border-2 border-gray-200',
  filled: 'bg-gray-50',
};

const Card = ({
  children,
  variant = 'default',
  className,
  hover = false,
  animate = false,
  onClick,
  ...props
}) => {
  const Comp = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Comp
      className={cn(
        'rounded-xl overflow-hidden',
        cardVariants[variant],
        hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4 border-b border-gray-100', className)} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-100', className)} {...props}>
    {children}
  </div>
);

const CardImage = ({ src, alt, className, ...props }) => (
  <div className={cn('relative overflow-hidden', className)}>
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      {...props}
    />
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-sm text-gray-500 mt-1', className)} {...props}>
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
