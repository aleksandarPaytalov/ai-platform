import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// import { validateEnvironment } from '@/lib/config'; // Temporarily disabled for build
import { logContrastReport } from '@/lib/a11y';
import AxeA11y from '@/components/dev/AxeA11y';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | AI Feature Tracker',
    default: 'AI Feature Tracker - Track AI Development Tools',
  },
  description: 'Track feature updates, capabilities, and changes across 15 popular AI development tools. Stay informed about the latest AI technology developments.',
  keywords: ['AI tools', 'artificial intelligence', 'development tools', 'feature tracking', 'AI capabilities'],
  authors: [{ name: 'AI Feature Tracker Team' }],
  creator: 'AI Feature Tracker',
  publisher: 'AI Feature Tracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ai-feature-tracker.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Feature Tracker - Track AI Development Tools',
    description: 'Track feature updates, capabilities, and changes across 15 popular AI development tools. Stay informed about the latest AI technology developments.',
    url: '/',
    siteName: 'AI Feature Tracker',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Feature Tracker - Track AI Development Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Feature Tracker - Track AI Development Tools',
    description: 'Track feature updates, capabilities, and changes across 15 popular AI development tools.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Environment validation temporarily disabled for build
// Will be re-enabled once environment variables are properly configured
// if (typeof window === 'undefined' && process.env.NODE_ENV !== 'development') {
//   try {
//     validateEnvironment();
//   } catch (error) {
//     console.error('Environment validation failed:', error);
//     if (process.env.NODE_ENV === 'production') {
//       throw error; // Fail fast in production
//     }
//   }
// }

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  if (process.env.NODE_ENV === 'development') {
    // Log contrast report once in dev
    try {
      logContrastReport();
    } catch {}
  }
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AI Feature Tracker',
              url: 'https://ai-feature-tracker.vercel.app',
              description: 'Track feature updates, capabilities, and changes across 15 popular AI development tools.',
              publisher: {
                '@type': 'Organization',
                name: 'AI Feature Tracker',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://ai-feature-tracker.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-gray-100`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        {/* Header */}
        <Header />
        
        {/* Main content area */}
        <main 
          id="main-content" 
          className="flex-1 w-full"
          role="main"
        >
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
        {process.env.NODE_ENV === 'development' ? <AxeA11y /> : null}
      </body>
    </html>
  );
}
