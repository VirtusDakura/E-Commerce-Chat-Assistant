import { cn } from '../../lib/utils';

/**
 * PageContainer - A responsive container wrapper for consistent page padding
 * Provides proper max-width constraints and safe area support
 */
const PageContainer = ({
    children,
    className,
    narrow = false,
    noPadding = false,
    ...props
}) => (
    <div
        className={cn(
            "container mx-auto",
            !noPadding && "px-4 sm:px-6 lg:px-8",
            narrow && "max-w-4xl",
            className
        )}
        {...props}
    >
        {children}
    </div>
);

export default PageContainer;
