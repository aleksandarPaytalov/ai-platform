/**
 * Responsive Breakpoint System
 * Matches Tailwind CSS default breakpoints for consistency
 */

// Breakpoint constants matching Tailwind CSS defaults
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Breakpoint names type
export type BreakpointName = keyof typeof BREAKPOINTS;

// Breakpoint values type
export type BreakpointValue = typeof BREAKPOINTS[BreakpointName];

// Responsive configuration type for components
export interface ResponsiveConfig<T> {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Device type definitions
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * Get the current breakpoint based on window width
 */
export const getCurrentBreakpoint = (width: number = typeof window !== 'undefined' ? window.innerWidth : 1024): BreakpointName | 'base' => {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'base';
};

/**
 * Get device type based on window width
 */
export const getDeviceType = (width: number = typeof window !== 'undefined' ? window.innerWidth : 1024): DeviceType => {
  if (width >= BREAKPOINTS.xl) return 'wide';
  if (width >= BREAKPOINTS.lg) return 'desktop';
  if (width >= BREAKPOINTS.md) return 'tablet';
  return 'mobile';
};

/**
 * Check if current width is at or above a specific breakpoint
 */
export const isBreakpointUp = (breakpoint: BreakpointName, width: number = typeof window !== 'undefined' ? window.innerWidth : 1024): boolean => {
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Check if current width is below a specific breakpoint
 */
export const isBreakpointDown = (breakpoint: BreakpointName, width: number = typeof window !== 'undefined' ? window.innerWidth : 1024): boolean => {
  return width < BREAKPOINTS[breakpoint];
};

/**
 * Check if current width is between two breakpoints
 */
export const isBreakpointBetween = (
  min: BreakpointName, 
  max: BreakpointName, 
  width: number = typeof window !== 'undefined' ? window.innerWidth : 1024
): boolean => {
  return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max];
};

/**
 * Generate CSS media query string for a breakpoint
 */
export const getMediaQuery = (breakpoint: BreakpointName, direction: 'up' | 'down' = 'up'): string => {
  const value = BREAKPOINTS[breakpoint];
  return direction === 'up' 
    ? `(min-width: ${value}px)`
    : `(max-width: ${value - 1}px)`;
};

/**
 * Utility to resolve responsive configuration value for current breakpoint
 */
export const resolveResponsiveValue = <T>(
  config: ResponsiveConfig<T>,
  currentBreakpoint: BreakpointName | 'base' = getCurrentBreakpoint()
): T | undefined => {
  // Try to get value for current breakpoint first, then fall back through smaller breakpoints
  if (currentBreakpoint !== 'base' && config[currentBreakpoint] !== undefined) {
    return config[currentBreakpoint];
  }
  
  // Fallback logic for smaller breakpoints
  const breakpointOrder: (BreakpointName | 'default')[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'default'];
  const currentIndex = currentBreakpoint === 'base' ? breakpointOrder.length - 1 : breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (bp === 'default' && config.default !== undefined) {
      return config.default;
    }
    if (bp !== 'default' && config[bp as BreakpointName] !== undefined) {
      return config[bp as BreakpointName];
    }
  }
  
  return config.default;
};

/**
 * Generate responsive CSS classes based on configuration
 */
export const generateResponsiveClasses = <T>(
  config: ResponsiveConfig<T>,
  classMapper: (value: T) => string
): string[] => {
  const classes: string[] = [];
  
  // Add default class
  if (config.default !== undefined) {
    classes.push(classMapper(config.default));
  }
  
  // Add responsive classes
  (['sm', 'md', 'lg', 'xl', '2xl'] as const).forEach(breakpoint => {
    if (config[breakpoint] !== undefined) {
      const className = classMapper(config[breakpoint]!);
      classes.push(`${breakpoint}:${className}`);
    }
  });
  
  return classes;
};

/**
 * Custom breakpoint definitions for the AI Feature Tracker
 */
export const APP_BREAKPOINTS = {
  ...BREAKPOINTS,
  // Custom breakpoints for specific use cases
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  ultrawide: 1920,
} as const;

/**
 * Predefined responsive configurations for common use cases
 */
export const RESPONSIVE_PRESETS = {
  // Grid columns
  gridColumns: {
    autoResponsive: { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    cardGrid: { default: 1, sm: 2, lg: 3, xl: 4 },
    listGrid: { default: 1, md: 2, xl: 3 },
    dashboardGrid: { default: 1, md: 2, lg: 3, xl: 4, '2xl': 5 },
  },
  // Spacing
  spacing: {
    compact: { default: 2, sm: 3, md: 4, lg: 6 },
    comfortable: { default: 4, sm: 6, md: 8, lg: 12 },
    spacious: { default: 6, sm: 8, md: 12, lg: 16, xl: 20 },
  },
  // Container padding
  containerPadding: {
    tight: { default: 2, sm: 4, md: 6, lg: 8 },
    normal: { default: 4, sm: 6, md: 8, lg: 12 },
    loose: { default: 6, sm: 8, md: 12, lg: 16, xl: 20 },
  },
} as const;

/**
 * Debugging utilities for development
 */
export const debugBreakpoints = () => {
  if (typeof window === 'undefined') return;
  
  const width = window.innerWidth;
  const currentBreakpoint = getCurrentBreakpoint(width);
  const deviceType = getDeviceType(width);
  
  console.group('🔍 Breakpoint Debug Info');
  console.log('Window width:', width);
  console.log('Current breakpoint:', currentBreakpoint);
  console.log('Device type:', deviceType);
  console.log('Breakpoint values:', BREAKPOINTS);
  console.groupEnd();
};

/**
 * Test if window matches a media query
 */
export const matchesMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
};

/**
 * Get all active breakpoints for current window width
 */
export const getActiveBreakpoints = (width: number = typeof window !== 'undefined' ? window.innerWidth : 1024): BreakpointName[] => {
  const activeBreakpoints: BreakpointName[] = [];
  
  (['sm', 'md', 'lg', 'xl', '2xl'] as const).forEach(breakpoint => {
    if (width >= BREAKPOINTS[breakpoint]) {
      activeBreakpoints.push(breakpoint);
    }
  });
  
  return activeBreakpoints;
};