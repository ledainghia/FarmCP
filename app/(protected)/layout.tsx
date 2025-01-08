import ThemeCustomize from '@/components/partials/customizer';
import DashCodeFooter from '@/components/partials/footer';
import DashCodeHeader from '@/components/partials/header';
import DashCodeSidebar from '@/components/partials/sidebar';
import LayoutContentProvider from '@/providers/content.provider';
import LayoutProvider from '@/providers/layout.provider';
import LoginProvider from '@/providers/login.provider';

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutProvider>
      <LoginProvider>
        <ThemeCustomize />
        <DashCodeHeader />
        <DashCodeSidebar />
        <LayoutContentProvider>{children}</LayoutContentProvider>
        <DashCodeFooter />
      </LoginProvider>
    </LayoutProvider>
  );
};

export default layout;
