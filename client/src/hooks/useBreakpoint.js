import { useState, useEffect } from 'react';

/**
 * useBreakpoint - A custom hook to detect current responsive breakpoint
 * Returns the current breakpoint name and helper booleans
 */
export const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState('base');

    useEffect(() => {
        const getBreakpoint = () => {
            const width = window.innerWidth;
            if (width >= 1536) return '2xl';
            if (width >= 1280) return 'xl';
            if (width >= 1024) return 'lg';
            if (width >= 768) return 'md';
            if (width >= 640) return 'sm';
            return 'base';
        };

        const handleResize = () => setBreakpoint(getBreakpoint());

        // Set initial value
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        breakpoint,
        isMobile: ['base', 'sm'].includes(breakpoint),
        isTablet: breakpoint === 'md',
        isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
        isSmall: breakpoint === 'base',
        isMediumUp: ['md', 'lg', 'xl', '2xl'].includes(breakpoint),
        isLargeUp: ['lg', 'xl', '2xl'].includes(breakpoint),
    };
};

export default useBreakpoint;
