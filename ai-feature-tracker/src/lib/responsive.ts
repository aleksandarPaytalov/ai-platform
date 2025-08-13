import { useEffect, useState, useMemo } from 'react';
import { BREAKPOINTS, getCurrentBreakpoint, getDeviceType } from './breakpoints';
import type { BreakpointName, DeviceType } from './breakpoints';

/**
 * Responsive Utilities and Helpers
 * Provides React hooks and utilities for responsive behavior
 */

// Viewport detection utilities
export const getViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Device type detection
export const detectDeviceType = (width?: number): DeviceType => {
  const actualWidth = width ?? getViewportSize().width;
  return getDeviceType(actualWidth);
};

// Touch detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Orientation detection
export const getOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'landscape';
  const { width, height } = getViewportSize();
  return width > height ? 'landscape' : 'portrait';
};

// Responsive class generation
export const generateResponsiveClasses = (
  _baseClass: string,
  responsiveValues: Partial<Record<BreakpointName | 'default', string>>
): string[] => {
  const classes: string[] = [];
  
  if (responsiveValues.default) {
    classes.push(responsiveValues.default);
  }
  
  (['sm', 'md', 'lg', 'xl', '2xl'] as const).forEach(breakpoint => {
    if (responsiveValues[breakpoint]) {
      classes.push(`${breakpoint}:${responsiveValues[breakpoint]}`);
    }
  });
  
  return classes;
};

// Custom hooks for responsive behavior

/**
 * Hook to get current viewport size with debounced updates
 */
export const useViewportSize = (debounceMs: number = 100) => {
  const [size, setSize] = useState(getViewportSize);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize(getViewportSize());
      }, debounceMs);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceMs]);
  
  return size;
};

/**
 * Hook to get current breakpoint
 */
export const useBreakpoint = () => {
  const { width } = useViewportSize();
  return useMemo(() => getCurrentBreakpoint(width), [width]);
};

/**
 * Hook to check if current breakpoint is at or above specified breakpoint
 */
export const useBreakpointUp = (breakpoint: BreakpointName) => {
  const { width } = useViewportSize();
  return useMemo(() => width >= BREAKPOINTS[breakpoint], [width, breakpoint]);
};

/**
 * Hook to check if current breakpoint is below specified breakpoint
 */
export const useBreakpointDown = (breakpoint: BreakpointName) => {
  const { width } = useViewportSize();
  return useMemo(() => width < BREAKPOINTS[breakpoint], [width, breakpoint]);
};

/**
 * Hook to get device type
 */
export const useDeviceType = (): DeviceType => {
  const { width } = useViewportSize();
  return useMemo(() => getDeviceType(width), [width]);
};

/**
 * Hook for responsive value selection
 */
export const useResponsiveValue = <T>(
  values: Partial<Record<BreakpointName | 'default', T>>
): T | undefined => {
  const currentBreakpoint = useBreakpoint();
  
  return useMemo(() => {
    // Try current breakpoint first
    if (currentBreakpoint !== 'base' && values[currentBreakpoint] !== undefined) {
      return values[currentBreakpoint];
    }
    
    // Fall back through smaller breakpoints
    const breakpointOrder: (BreakpointName | 'default')[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'default'];
    const currentIndex = currentBreakpoint === 'base' ? breakpointOrder.length - 1 : breakpointOrder.indexOf(currentBreakpoint);
    
    for (let i = currentIndex; i < breakpointOrder.length; i++) {
      const bp = breakpointOrder[i];
      if (bp === 'default' && values.default !== undefined) {
        return values.default;
      }
      if (bp !== 'default' && values[bp as BreakpointName] !== undefined) {
        return values[bp as BreakpointName];
      }
    }
    
    return values.default;
  }, [values, currentBreakpoint]);
};

/**
 * Hook to detect touch devices
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);
  
  return isTouch;
};

/**
 * Hook to detect orientation changes
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(getOrientation());
    };
    
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);
  
  return orientation;
};

/**
 * Hook for media query matching
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  
  return matches;
};

/**
 * Hook for conditional rendering based on breakpoint
 */
export const useShowAt = (breakpoint: BreakpointName, direction: 'up' | 'down' = 'up') => {
  const showUp = useBreakpointUp(breakpoint);
  const showDown = useBreakpointDown(breakpoint);
  return direction === 'up' ? showUp : showDown;
};

/**
 * Hook for container queries (experimental)
 */
export const useContainerQuery = (containerRef: React.RefObject<HTMLElement>, query: string) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // Simple width-based container query
        if (query.includes('min-width:')) {
          const minWidth = parseInt(query.match(/min-width:\s*(\d+)px/)?.[1] || '0');
          setMatches(width >= minWidth);
        } else if (query.includes('max-width:')) {
          const maxWidth = parseInt(query.match(/max-width:\s*(\d+)px/)?.[1] || '9999');
          setMatches(width <= maxWidth);
        }
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, query]);
  
  return matches;
};

// Responsive image utilities
export const getResponsiveImageSizes = (breakpoints?: Partial<Record<BreakpointName, string>>) => {
  const defaultSizes = {
    sm: '(max-width: 640px) 100vw',
    md: '(max-width: 768px) 100vw',
    lg: '(max-width: 1024px) 50vw',
    xl: '(max-width: 1280px) 33vw',
    '2xl': '25vw',
  };
  
  const mergedSizes = { ...defaultSizes, ...breakpoints };
  
  return Object.entries(mergedSizes)
    .map(([_, size]) => size)
    .join(', ');
};

// Typography scaling helpers
export const getResponsiveTextSize = (
  baseSize: string,
  scale?: Partial<Record<BreakpointName, string>>
) => {
  const classes = [baseSize];
  
  if (scale) {
    Object.entries(scale).forEach(([bp, size]) => {
      classes.push(`${bp}:${size}`);
    });
  }
  
  return classes.join(' ');
};

// Spacing calculation utilities
export const calculateResponsiveSpacing = (
  baseSpacing: number,
  multipliers?: Partial<Record<BreakpointName, number>>
): Partial<Record<BreakpointName | 'default', number>> => {
  const result: Partial<Record<BreakpointName | 'default', number>> = {
    default: baseSpacing,
  };
  
  if (multipliers) {
    Object.entries(multipliers).forEach(([bp, multiplier]) => {
      result[bp as BreakpointName] = Math.round(baseSpacing * multiplier);
    });
  }
  
  return result;
};

// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Reduced motion detection
export const useReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

// High contrast detection
export const useHighContrast = (): boolean => {
  return useMediaQuery('(prefers-contrast: high)');
};

// Dark mode detection (system preference)
export const useSystemDarkMode = (): boolean => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};