
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  withSidebar?: boolean;
}

/**
 * A responsive container that handles padding differently on mobile vs desktop
 */
const ResponsiveContainer = ({
  children,
  className,
  withSidebar = true
}: ResponsiveContainerProps) => {
  const isMobile = useIsMobile();

  const mobileClasses = isMobile 
    ? "content-mobile content-spacing-mobile" 
    : "p-4 md:p-6 lg:p-8";

  if (withSidebar) {
    return (
      <SidebarInset>
        <main className={cn("flex-1", mobileClasses, className)}>
          {children}
        </main>
      </SidebarInset>
    );
  }

  return (
    <main className={cn("flex-1", mobileClasses, className)}>
      {children}
    </main>
  );
};

export default ResponsiveContainer;
