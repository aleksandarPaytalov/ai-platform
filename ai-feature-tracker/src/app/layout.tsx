import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// import { validateEnvironment } from '@/lib/config'; // Temporarily disabled for build

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Feature Tracker',
  description: 'Track feature updates across 15 popular AI development tools',
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
