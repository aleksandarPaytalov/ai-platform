/**
 * Route utilities and validation for the AI Feature Tracker application
 * Provides consistent URL generation, validation, and navigation helpers
 */

// ===== ROUTE CONSTANTS =====

export const ROUTES = {
  HOME: '/',
  TOOLS: '/tools',
  TOOL_DETAIL: (slug: string) => `/tools/${slug}`,
  SEARCH: '/search',
  ANALYTICS: '/analytics',
  API: {
    TOOLS: '/api/tools',
    TOOL_DETAIL: (slug: string) => `/api/tools/${slug}`,
    SEARCH: '/api/search',
    HEALTH: '/api/health',
  },
} as const;

// ===== TYPE DEFINITIONS =====

export interface RouteParams {
  slug?: string;
  query?: string;
  category?: string;
  page?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  isExternal?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// ===== SLUG VALIDATION =====

/**
 * Validates a tool slug format
 * Slugs must be lowercase letters, numbers, and hyphens only
 * Cannot start or end with hyphens, cannot have consecutive hyphens
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Basic format check: lowercase letters, numbers, and hyphens only
  const basicFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  
  // Length constraints
  const validLength = slug.length >= 2 && slug.length <= 50;
  
  // Cannot be reserved words
  const reservedWords = ['api', 'admin', 'auth', 'search', 'tools', 'help', 'about', 'contact'];
  const notReserved = !reservedWords.includes(slug);
  
  return basicFormat && validLength && notReserved;
}

/**
 * Sanitizes a string to create a valid slug
 */
export function createSlug(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Converts a slug back to a display name
 */
export function slugToDisplayName(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    return '';
  }

  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ===== URL GENERATION =====

/**
 * Generates a tool detail URL with validation
 */
export function generateToolUrl(slug: string): string {
  if (!isValidSlug(slug)) {
    console.warn(`Invalid slug provided: ${slug}`);
    return ROUTES.TOOLS;
  }
  return ROUTES.TOOL_DETAIL(slug);
}

/**
 * Generates search URL with query parameters
 */
export function generateSearchUrl(query: string, filters?: Record<string, string>): string {
  const url = new URL(ROUTES.SEARCH, 'http://localhost');
  
  if (query.trim()) {
    url.searchParams.set('q', query.trim());
  }
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }
  
  return url.pathname + url.search;
}

/**
 * Generates pagination URLs
 */
export function generatePaginationUrl(baseUrl: string, page: number, totalPages: number): string | null {
  if (page < 1 || page > totalPages) {
    return null;
  }
  
  const url = new URL(baseUrl, 'http://localhost');
  
  if (page > 1) {
    url.searchParams.set('page', page.toString());
  } else {
    url.searchParams.delete('page');
  }
  
  return url.pathname + url.search;
}

// ===== PARAMETER VALIDATION =====

/**
 * Validates and sanitizes URL parameters
 */
export function validateRouteParams(params: Record<string, unknown>): RouteParams {
  const validated: RouteParams = {};
  
  // Validate slug
  if (params['slug'] && typeof params['slug'] === 'string') {
    if (isValidSlug(params['slug'])) {
      validated.slug = params['slug'];
    }
  }
  
  // Validate query
  if (params['query'] && typeof params['query'] === 'string') {
    const trimmed = params['query'].trim();
    if (trimmed.length > 0 && trimmed.length <= 200) {
      validated.query = trimmed;
    }
  }
  
  // Validate category
  if (params['category'] && typeof params['category'] === 'string') {
    const category = params['category'].toLowerCase();
    if (/^[a-z0-9-]+$/.test(category) && category.length <= 30) {
      validated.category = category;
    }
  }
  
  // Validate page
  if (params['page'] && typeof params['page'] === 'string') {
    const pageNum = parseInt(params['page'], 10);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= 1000) {
      validated.page = params['page'];
    }
  }
  
  return validated;
}

// ===== BREADCRUMB GENERATION =====

/**
 * Generates breadcrumb navigation for routes
 */
export function generateBreadcrumbs(pathname: string, params?: RouteParams): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: ROUTES.HOME }
  ];
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) {
    if (breadcrumbs[0]) {
      breadcrumbs[0].current = true;
    }
    return breadcrumbs;
  }
  
  if (pathSegments[0] === 'tools') {
    breadcrumbs.push({ label: 'Tools', href: ROUTES.TOOLS });
    
    if (pathSegments.length > 1 && params?.slug) {
      breadcrumbs.push({
        label: slugToDisplayName(params.slug),
        href: generateToolUrl(params.slug),
        current: true
      });
    } else {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      if (lastBreadcrumb) {
        lastBreadcrumb.current = true;
      }
    }
  } else if (pathSegments[0] === 'search') {
    breadcrumbs.push({ label: 'Search', href: ROUTES.SEARCH, current: true });
  } else if (pathSegments[0] === 'analytics') {
    breadcrumbs.push({ label: 'Analytics', href: ROUTES.ANALYTICS, current: true });
  }
  
  return breadcrumbs;
}

// ===== NAVIGATION HELPERS =====

/**
 * Main navigation items for the application
 */
export function getMainNavigation(): NavigationItem[] {
  return [
    {
      label: 'Dashboard',
      href: ROUTES.HOME,
      description: 'Overview and statistics'
    },
    {
      label: 'AI Tools',
      href: ROUTES.TOOLS,
      description: 'Browse 15+ AI development tools'
    },
    {
      label: 'Search',
      href: ROUTES.SEARCH,
      description: 'Find specific tools and features'
    },
    {
      label: 'Analytics',
      href: ROUTES.ANALYTICS,
      description: 'Usage and performance metrics'
    }
  ];
}

/**
 * Footer navigation items
 */
export function getFooterNavigation(): Record<string, NavigationItem[]> {
  return {
    Tools: [
      { label: 'All Tools', href: ROUTES.TOOLS },
      { label: 'Code Generation', href: `${ROUTES.TOOLS}?category=code-generation` },
      { label: 'Conversational AI', href: `${ROUTES.TOOLS}?category=conversational` },
      { label: 'Image Generation', href: `${ROUTES.TOOLS}?category=image-generation` }
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Status', href: '/status' }
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Bug Reports', href: '/issues' },
      { label: 'Feature Requests', href: '/features' }
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'License', href: '/license' }
    ]
  };
}

// ===== REDIRECT UTILITIES =====

/**
 * Handles invalid routes and suggests alternatives
 */
export function getRouteRedirect(pathname: string): string | null {
  // Common typos and alternatives
  const redirectMap: Record<string, string> = {
    '/tool': ROUTES.TOOLS,
    '/ai-tools': ROUTES.TOOLS,
    '/dashboard': ROUTES.HOME,
    '/home': ROUTES.HOME,
    '/find': ROUTES.SEARCH,
    '/lookup': ROUTES.SEARCH,
  };
  
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, '');
  return redirectMap[normalizedPath] || null;
}

/**
 * Checks if a route is accessible (not under construction)
 */
export function isRouteAccessible(pathname: string): boolean {
  const underConstruction = ['/analytics', '/search', '/help', '/docs'];
  return !underConstruction.some(route => pathname.startsWith(route));
}

// ===== ERROR HANDLING =====

/**
 * Handles route errors and provides error context
 */
export function handleRouteError(error: Error, pathname: string, params?: RouteParams): {
  message: string;
  suggestions: string[];
  canRetry: boolean;
} {
  const isSlugError = params?.slug && !isValidSlug(params.slug);
  const isNotFound = error.message.includes('404') || error.message.includes('not found');
  const isToolRoute = pathname.startsWith('/tools/');
  
  if (isSlugError) {
    return {
      message: `Invalid tool identifier: ${params.slug}`,
      suggestions: [
        'Check the tool name spelling',
        'Browse all tools to find the correct one',
        'Use the search function'
      ],
      canRetry: false
    };
  }
  
  if (isNotFound) {
    const baseMessage = isToolRoute 
      ? 'The requested AI tool could not be found'
      : 'The requested page could not be found';
      
    return {
      message: baseMessage,
      suggestions: [
        'Check the URL for typos',
        'Go back to the previous page',
        isToolRoute ? 'Browse all AI tools' : 'Visit the main dashboard'
      ],
      canRetry: false
    };
  }
  
  return {
    message: `An error occurred while loading ${pathname}`,
    suggestions: [
      'Try refreshing the page',
      'Check your internet connection',
      'Contact support if the problem persists'
    ],
    canRetry: true
  };
}

// ===== ANALYTICS TRACKING =====

/**
 * Generates tracking data for route navigation
 */
export function getRouteAnalytics(pathname: string, params?: RouteParams): Record<string, unknown> {
  return {
    route: pathname,
    timestamp: new Date().toISOString(),
    params: params || {},
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    referrer: typeof document !== 'undefined' ? document.referrer : null,
  };
}

/**
 * Tracks route performance metrics
 */
export function trackRoutePerformance(pathname: string, startTime: number): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const duration = performance.now() - startTime;
    
    // In production, send to analytics service
    console.debug(`Route ${pathname} loaded in ${duration.toFixed(2)}ms`);
    
    // Example: Send to analytics service
    // analytics.track('route_performance', {
    //   pathname,
    //   duration,
    //   timestamp: Date.now()
    // });
  }
}