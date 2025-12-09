import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  rounded = true,
  className,
  ...props
}) => {
  const initials = name ? getInitials(name) : '';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden',
        'bg-blue-100 text-blue-600 font-medium',
        rounded ? 'rounded-full' : 'rounded-lg',
        avatarSizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

const AvatarGroup = ({ children, max = 4, size = 'md', className }) => {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'ring-2 ring-white rounded-full bg-gray-200 flex items-center justify-center',
            avatarSizes[size]
          )}
        >
          <span className="text-gray-600 font-medium">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

Avatar.Group = AvatarGroup;

export default Avatar;
