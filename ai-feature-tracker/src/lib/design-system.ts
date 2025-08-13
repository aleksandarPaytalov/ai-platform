/**
 * Design System Configuration
 * 
 * This file contains all design tokens, constants, and configuration
 * for the AI Feature Tracker design system. It provides consistent
 * theming, spacing, typography, and component variants.
 */

// Color Palette Constants with Semantic Naming
export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Secondary colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Semantic status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  // Neutral grays
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
} as const;

// Typography Scale with Consistent Font Sizes and Line Heights
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
  },
} as const;

// Spacing Scale Matching Tailwind CSS Defaults
export const spacing = {
  0: '0px',
  0.5: '0.125rem',    // 2px
  1: '0.25rem',       // 4px
  1.5: '0.375rem',    // 6px
  2: '0.5rem',        // 8px
  2.5: '0.625rem',    // 10px
  3: '0.75rem',       // 12px
  3.5: '0.875rem',    // 14px
  4: '1rem',          // 16px
  5: '1.25rem',       // 20px
  6: '1.5rem',        // 24px
  7: '1.75rem',       // 28px
  8: '2rem',          // 32px
  9: '2.25rem',       // 36px
  10: '2.5rem',       // 40px
  11: '2.75rem',      // 44px
  12: '3rem',         // 48px
  14: '3.5rem',       // 56px
  16: '4rem',         // 64px
  20: '5rem',         // 80px
  24: '6rem',         // 96px
  28: '7rem',         // 112px
  32: '8rem',         // 128px
  36: '9rem',         // 144px
  40: '10rem',        // 160px
  44: '11rem',        // 176px
  48: '12rem',        // 192px
  52: '13rem',        // 208px
  56: '14rem',        // 224px
  60: '15rem',        // 240px
  64: '16rem',        // 256px
  72: '18rem',        // 288px
  80: '20rem',        // 320px
  96: '24rem',        // 384px
} as const;

// Component Size Scales for Consistent Sizing
export const componentSizes = {
  button: {
    xs: {
      height: '1.5rem',      // 24px
      paddingX: '0.5rem',    // 8px
      paddingY: '0.125rem',  // 2px
      fontSize: 'xs',
      iconSize: '0.75rem',   // 12px
    },
    sm: {
      height: '2rem',        // 32px
      paddingX: '0.75rem',   // 12px
      paddingY: '0.25rem',   // 4px
      fontSize: 'sm',
      iconSize: '1rem',      // 16px
    },
    md: {
      height: '2.5rem',      // 40px
      paddingX: '1rem',      // 16px
      paddingY: '0.5rem',    // 8px
      fontSize: 'base',
      iconSize: '1.25rem',   // 20px
    },
    lg: {
      height: '3rem',        // 48px
      paddingX: '1.25rem',   // 20px
      paddingY: '0.75rem',   // 12px
      fontSize: 'lg',
      iconSize: '1.5rem',    // 24px
    },
    xl: {
      height: '3.5rem',      // 56px
      paddingX: '1.5rem',    // 24px
      paddingY: '1rem',      // 16px
      fontSize: 'xl',
      iconSize: '1.75rem',   // 28px
    },
  },
  
  input: {
    sm: {
      height: '2rem',        // 32px
      paddingX: '0.75rem',   // 12px
      fontSize: 'sm',
    },
    md: {
      height: '2.5rem',      // 40px
      paddingX: '1rem',      // 16px
      fontSize: 'base',
    },
    lg: {
      height: '3rem',        // 48px
      paddingX: '1.25rem',   // 20px
      fontSize: 'lg',
    },
  },
  
  badge: {
    xs: {
      paddingX: '0.375rem',  // 6px
      paddingY: '0.125rem',  // 2px
      fontSize: 'xs',
      height: '1rem',        // 16px
    },
    sm: {
      paddingX: '0.5rem',    // 8px
      paddingY: '0.125rem',  // 2px
      fontSize: 'xs',
      height: '1.25rem',     // 20px
    },
    md: {
      paddingX: '0.625rem',  // 10px
      paddingY: '0.25rem',   // 4px
      fontSize: 'sm',
      height: '1.5rem',      // 24px
    },
    lg: {
      paddingX: '0.75rem',   // 12px
      paddingY: '0.25rem',   // 4px
      fontSize: 'sm',
      height: '1.75rem',     // 28px
    },
  },
} as const;

// Animation and Transition Constants
export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  keyframes: {
    fadeIn: 'fadeIn 200ms ease-out',
    fadeOut: 'fadeOut 200ms ease-out',
    slideUp: 'slideUp 200ms ease-out',
    slideDown: 'slideDown 200ms ease-out',
    scale: 'scale 150ms ease-out',
    spin: 'spin 1s linear infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
  },
} as const;

// Breakpoint Definitions and Responsive Utilities
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
} as const;

// Accessibility Constants
export const accessibility = {
  // WCAG 2.1 AA contrast ratios
  contrastRatios: {
    normal: 4.5,     // Normal text minimum
    large: 3,        // Large text minimum
    enhanced: 7,     // AAA standard
  },
  
  // Focus styles
  focusRing: {
    width: '2px',
    style: 'solid',
    color: colors.primary[500],
    offset: '2px',
  },
  
  // Touch targets (minimum 44px for accessibility)
  touchTarget: {
    minSize: '44px',
  },
  
  // Screen reader constants
  screenReader: {
    srOnly: 'sr-only',
    notSrOnly: 'not-sr-only',
  },
} as const;

// Theme Configuration and Customization Options
export const theme = {
  // Light theme configuration
  light: {
    background: colors.neutral[50],
    foreground: colors.neutral[900],
    card: colors.neutral[0],
    cardForeground: colors.neutral[950],
    popover: colors.neutral[0],
    popoverForeground: colors.neutral[950],
    primary: colors.primary[600],
    primaryForeground: colors.neutral[50],
    secondary: colors.secondary[100],
    secondaryForeground: colors.secondary[900],
    muted: colors.secondary[100],
    mutedForeground: colors.secondary[500],
    accent: colors.secondary[100],
    accentForeground: colors.secondary[900],
    destructive: colors.error[500],
    destructiveForeground: colors.neutral[50],
    border: colors.secondary[200],
    input: colors.secondary[200],
    ring: colors.primary[600],
  },
  
  // Dark theme configuration (for future implementation)
  dark: {
    background: colors.neutral[950],
    foreground: colors.neutral[50],
    card: colors.neutral[950],
    cardForeground: colors.neutral[50],
    popover: colors.neutral[950],
    popoverForeground: colors.neutral[50],
    primary: colors.primary[400],
    primaryForeground: colors.neutral[900],
    secondary: colors.secondary[800],
    secondaryForeground: colors.secondary[50],
    muted: colors.secondary[800],
    mutedForeground: colors.secondary[400],
    accent: colors.secondary[800],
    accentForeground: colors.secondary[50],
    destructive: colors.error[900],
    destructiveForeground: colors.neutral[50],
    border: colors.secondary[800],
    input: colors.secondary[800],
    ring: colors.primary[400],
  },
} as const;

// Component Variant Definitions and Mapping
export const variants = {
  button: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      xs: 'h-6 px-2 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
      xl: 'h-14 px-8 text-xl',
    },
  },
  
  badge: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      error: 'bg-error text-error-foreground',
      info: 'bg-info text-info-foreground',
      outline: 'border border-input text-foreground',
    },
    size: {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1 text-sm',
    },
  },
  
  card: {
    variant: {
      default: 'bg-card text-card-foreground',
      elevated: 'bg-card text-card-foreground shadow-lg',
      outlined: 'bg-card text-card-foreground border border-border',
      filled: 'bg-secondary text-secondary-foreground',
    },
  },
} as const;

// Design Token Validation and Type Safety
export type ColorScale = typeof colors.primary;
export type ComponentSize = keyof typeof componentSizes.button;
export type BreakpointKey = keyof typeof breakpoints;
export type ThemeKey = keyof typeof theme.light;
export type ButtonVariant = keyof typeof variants.button.variant;
export type BadgeVariant = keyof typeof variants.badge.variant;

// Utility functions for design system
export const getColorValue = (color: string, shade: number = 500): string => {
  const colorParts = color.split('.');
  if (colorParts.length === 2) {
    const [colorName, shadeValue] = colorParts;
    return (colors as any)[colorName]?.[shadeValue] || color;
  }
  return color;
};

export const getSpacing = (value: keyof typeof spacing): string => {
  return spacing[value] || value.toString();
};

export const getBreakpoint = (breakpoint: BreakpointKey): string => {
  return breakpoints[breakpoint];
};

// Export all design system constants
export default {
  colors,
  typography,
  spacing,
  componentSizes,
  animations,
  breakpoints,
  mediaQueries,
  accessibility,
  theme,
  variants,
  getColorValue,
  getSpacing,
  getBreakpoint,
} as const;