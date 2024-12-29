import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vụ nuôi ',
  description: 'Quản lí vụ nuôi',
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
