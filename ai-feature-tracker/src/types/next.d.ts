// Next.js type extensions for AI Feature Tracker

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

// Extended page component with layout support
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

// Extended app props with layout support
export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// API route types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search params type for app router
export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// Page props type for app router
export interface PageProps {
  params: { [key: string]: string };
  searchParams: SearchParams;
}
