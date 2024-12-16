import type { Metadata } from 'next';
import { Inter, Quicksand } from 'next/font/google';
import './globals.css';
import './theme.css';
import { ThemeProvider } from '@/providers/theme-provider';
import MountedProvider from '@/providers/mounted.provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import toast, { Toaster as HotToast } from 'react-hot-toast';
const inter = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});
// const inter = Inter({ subsets: ['latin'] });

import DirectionProvider from '@/providers/direction-provider';

import ClientQueryProvider from '@/providers/ClientQueryProvider';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Manage your future farm',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const direction = 'ltrltr';
  return (
    <html lang={'vi'} dir={direction}>
      <body className={`${inter.className} dashcode-app`}>
        <ThemeProvider attribute='class' defaultTheme='light'>
          <MountedProvider>
            <DirectionProvider direction={direction}>
              <ClientQueryProvider>{children}</ClientQueryProvider>
            </DirectionProvider>
          </MountedProvider>
          <Toaster />
          <HotToast position='top-right' />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
