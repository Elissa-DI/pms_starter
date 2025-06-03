
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
