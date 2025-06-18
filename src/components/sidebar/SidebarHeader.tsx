
import React from 'react';
import { Box } from 'lucide-react';
import { SidebarHeader as SidebarHeaderContainer } from '@/components/ui/sidebar';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader = ({ isCollapsed }: SidebarHeaderProps) => {
  return (
    <SidebarHeaderContainer className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Box className="h-6 w-6" />
        </div>
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-gray-900">
            MALLDRE WMS
          </h1>
        )}
      </div>
    </SidebarHeaderContainer>
  );
};

export default SidebarHeader;
