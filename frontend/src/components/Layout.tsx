import { ReactNode } from 'react';
import Topbar from './Topbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <Topbar />
      <main className="pt-24 pb-12 px-8">
        {children}
      </main>
    </div>
  );
}
