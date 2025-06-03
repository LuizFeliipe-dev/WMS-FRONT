
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className={cn("min-h-screen flex w-full", isMobile && "app-layout")}>
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <header className={cn(
            "h-12 flex items-center border-b bg-white px-4",
            isMobile && "app-header"
          )}>
            <SidebarTrigger className={cn("mr-4", isMobile && "btn-icon-mobile")} />
            {isMobile && (
              <h1 className="text-lg font-semibold text-gray-900">
                Sistema de Estoque
              </h1>
            )}
          </header>
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
