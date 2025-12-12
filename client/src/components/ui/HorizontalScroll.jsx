import { useRef, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * HorizontalScroll - A horizontal scrollable container with hidden scrollbar
 * Supports auto-scroll animation and responsive behavior (grid on desktop, scroll on mobile)
 */
const HorizontalScroll = ({
    children,
    className,
    containerClassName,
    autoScroll = false,
    autoScrollSpeed = 30, // pixels per second
    pauseOnHover = true,
    showOnMobile = true, // If false, becomes grid on all sizes
    breakpoint = 'sm', // Breakpoint where it switches to grid
    gap = 3, // gap-3 default
    ...props
}) => {
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll effect
    useEffect(() => {
        if (!autoScroll || !scrollRef.current) return;
        if (pauseOnHover && isHovered) return;

        const container = scrollRef.current;
        let animationId;
        let lastTime = performance.now();

        const scroll = (currentTime) => {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            if (!isPaused) {
                container.scrollLeft += autoScrollSpeed * deltaTime;

                // Reset to beginning when reaching end
                if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                    container.scrollLeft = 0;
                }
            }

            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [autoScroll, autoScrollSpeed, isPaused, isHovered, pauseOnHover]);

    const gapClasses = {
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        6: 'gap-6',
    };

    const breakpointClasses = {
        sm: 'sm:grid sm:overflow-visible',
        md: 'md:grid md:overflow-visible',
        lg: 'lg:grid lg:overflow-visible',
    };

    return (
        <div
            className={cn('relative', containerClassName)}
            {...props}
        >
            <div
                ref={scrollRef}
                className={cn(
                    // Base horizontal scroll styles
                    'flex overflow-x-auto scrollbar-hide scroll-smooth',
                    gapClasses[gap] || 'gap-3',
                    // Snap scrolling for better UX
                    'snap-x snap-mandatory',
                    // On breakpoint and up, switch to grid if showOnMobile
                    showOnMobile && breakpointClasses[breakpoint],
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
            >
                {children}
            </div>
        </div>
    );
};

/**
 * HorizontalScrollItem - A snap-aligned item for HorizontalScroll
 */
const HorizontalScrollItem = ({
    children,
    className,
    minWidth = '280px',
    ...props
}) => (
    <div
        className={cn(
            'shrink-0 snap-start',
            className
        )}
        style={{ minWidth }}
        {...props}
    >
        {children}
    </div>
);

HorizontalScroll.Item = HorizontalScrollItem;

export default HorizontalScroll;
