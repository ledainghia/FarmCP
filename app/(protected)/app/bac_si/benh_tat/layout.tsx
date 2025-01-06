import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Báo cáo bệnh tật ',
  description: 'Báo cáo bệnh tật',
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
