import { cn } from '../../lib/utils';

/**
 * ResponsiveGrid - A responsive grid component for consistent grid layouts
 * Automatically handles breakpoints and gap scaling
 */
const ResponsiveGrid = ({
    children,
    cols = 4,
    gap = 6,
    className,
    ...props
}) => {
    const colClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    };

    const gapClasses = {
        2: 'gap-2',
        3: 'gap-2 sm:gap-3',
        4: 'gap-3 sm:gap-4',
        6: 'gap-4 sm:gap-6',
        8: 'gap-4 sm:gap-6 lg:gap-8',
    };

    return (
        <div
            className={cn(
                'grid',
                colClasses[cols] || colClasses[4],
                gapClasses[gap] || gapClasses[6],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default ResponsiveGrid;
