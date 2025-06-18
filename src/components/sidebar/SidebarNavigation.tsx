
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { NavigationSection } from '@/types/navigation';

interface SidebarNavigationProps {
  sections: NavigationSection[];
  isCollapsed: boolean;
}

const SidebarNavigation = ({ sections, isCollapsed }: SidebarNavigationProps) => {
  return (
    <SidebarContent className="px-6 py-4">
      {sections.map((section) => (
        <SidebarGroup key={section.title}>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {section.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full",
                          isActive && "bg-gray-100 font-medium text-gray-900"
                        )
                      }
                    >
                      <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                      {!isCollapsed && item.name}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
};

export default SidebarNavigation;
