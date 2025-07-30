// Global type declarations for AI Feature Tracker

declare global {
  // Environment variables (client-side accessible)
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_SUPABASE_URL: string;
      readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      readonly NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
      readonly NEXT_PUBLIC_APP_URL?: string;
      readonly NEXT_PUBLIC_BUILD_TIME: string;
    }
  }

  // Custom global interfaces
  interface Window {
    // Add any window extensions here
    gtag?: (...args: any[]) => void;
  }

  // Module declarations for untyped packages
  declare module '*.svg' {
    const content: any;
    export default content;
  }

  declare module '*.png' {
    const content: string;
    export default content;
  }

  declare module '*.jpg' {
    const content: string;
    export default content;
  }

  declare module '*.jpeg' {
    const content: string;
    export default content;
  }

  declare module '*.gif' {
    const content: string;
    export default content;
  }

  declare module '*.webp' {
    const content: string;
    export default content;
  }
}

// Ensure this file is treated as a module
export {};
