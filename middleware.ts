import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from '@/config';

export default async function middleware(request: NextRequest) {
  // Step 1: Use the incoming request (example)
  const defaultLocale = 'en';

  // Step 2: Create and call the next-intl middleware (example)
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
  });
  const response = await handleI18nRouting(request);

  // Step 3: Alter the response (example)
  response.headers.set('en', defaultLocale);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en)/:path*'],
};
