import LayoutProvider from '@/providers/layout.provider';
import LayoutContentProvider from '@/providers/content.provider';
import DashCodeSidebar from '@/components/partials/sidebar';
import DashCodeFooter from '@/components/partials/footer';
import ThemeCustomize from '@/components/partials/customizer';
import DashCodeHeader from '@/components/partials/header';

import { redirect } from 'next/navigation';
import { isAccessTokenValid } from '@/utils/isLogin';
import { useEffect } from 'react';

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutProvider>
      <ThemeCustomize />
      <DashCodeHeader />
      <DashCodeSidebar />
      <LayoutContentProvider>{children}</LayoutContentProvider>
      <DashCodeFooter />
    </LayoutProvider>
  );
};

export default layout;
