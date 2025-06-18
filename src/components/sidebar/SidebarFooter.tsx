
import React from 'react';
import { SidebarFooter as SidebarFooterContainer } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface SidebarFooterProps {
  onLogout: () => void;
  isCollapsed: boolean;
}

const SidebarFooter = ({ onLogout, isCollapsed }: SidebarFooterProps) => {
  return (
    <SidebarFooterContainer className="border-t border-gray-200 px-6 py-4">
      <Button
        onClick={onLogout}
        className="w-full py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
      >
        {!isCollapsed ? 'Sair' : '↩'}
      </Button>
    </SidebarFooterContainer>
  );
};

export default SidebarFooter;
