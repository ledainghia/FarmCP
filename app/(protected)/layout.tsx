import ThemeCustomize from '@/components/partials/customizer';
import DashCodeFooter from '@/components/partials/footer';
import DashCodeHeader from '@/components/partials/header';
import DashCodeSidebar from '@/components/partials/sidebar';
import LayoutContentProvider from '@/providers/content.provider';
import LayoutProvider from '@/providers/layout.provider';

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
