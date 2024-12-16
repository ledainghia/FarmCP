import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lí công việc nông trại',
  description: 'Tasks management',
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
