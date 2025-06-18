
import React from 'react';
import { useAuth } from '../lib/auth';
import {
  Sidebar as SidebarContainer,
  useSidebar,
} from '@/components/ui/sidebar';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavigation from './sidebar/SidebarNavigation';
import SidebarFooter from './sidebar/SidebarFooter';
import { useFilteredNavigation } from '@/hooks/useFilteredNavigation';

const Sidebar = () => {
  const { logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const filteredNavigationSections = useFilteredNavigation();

  return (
    <SidebarContainer className="border-r border-gray-200">
      <SidebarHeader isCollapsed={isCollapsed} />
      <SidebarNavigation sections={filteredNavigationSections} isCollapsed={isCollapsed} />
      <SidebarFooter onLogout={logout} isCollapsed={isCollapsed} />
    </SidebarContainer>
  );
};

export default Sidebar;
