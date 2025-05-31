
import React from 'react';
import { cn } from '@/lib/utils';
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

  return (
    <main
      className={cn(
        "flex-1 p-4 md:p-6 lg:p-8",
        withSidebar && !isMobile && "md:ml-64",
        isMobile && "pt-16", // Add top padding for mobile menu button
        className
      )}
    >
      {children}
    </main>
  );
};

export default ResponsiveContainer;
