
import React from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Truck,
  ShoppingBag,
  Archive,
  CheckSquare,
  BarChart3,
  Eye,
  Scale,
  BookOpen,
  Zap,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const navigationSections = [
    {
      title: 'Principal',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard
        }
      ]
    },
    {
      title: 'Cadastros',
      items: [
        {
          name: 'Produtos',
          href: '/items',
          icon: ShoppingBag
        },
        {
          name: 'Grupos de Produtos',
          href: '/groups',
          icon: Package
        },
        {
          name: 'Fornecedores',
          href: '/suppliers',
          icon: Truck
        },
        {
          name: 'Racks',
          href: '/racks',
          icon: Archive
        },
        {
          name: 'Zonas',
          href: '/zones',
          icon: LayoutDashboard
        },
        {
          name: 'Tipos de Prateleira',
          href: '/shelf-types',
          icon: BookOpen
        },
        {
          name: 'Usuários',
          href: '/users',
          icon: Users
        }
      ]
    },
    {
      title: 'Eventos',
      items: [
        {
          name: 'Entrada',
          href: '/entry',
          icon: CheckSquare
        },
        {
          name: 'Inventário',
          href: '/inventory',
          icon: BarChart3
        },
        {
          name: 'Transação',
          href: '/transaction',
          icon: Zap
        },
        {
          name: 'Tarefas',
          href: '/tasks',
          icon: CheckSquare
        }
      ]
    },
    {
      title: 'Gerenciamento',
      items: [
        {
          name: 'Estatísticas',
          href: '/statistics',
          icon: BarChart3
        },
        {
          name: 'Visualização 3D',
          href: '/location-view',
          icon: Eye
        },
        {
          name: 'Balanço',
          href: '/balance',
          icon: Scale
        }
      ]
    }
  ];

  return (
    <SidebarContainer className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 px-6 py-4">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-gray-900">
            Painel Administrativo
          </h1>
        )}
      </SidebarHeader>
      
      <SidebarContent className="px-6 py-4">
        {navigationSections.map((section) => (
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

      <SidebarFooter className="border-t border-gray-200 px-6 py-4">
        <Button
          onClick={logout}
          className="w-full py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
        >
          {!isCollapsed ? 'Sair' : '↩'}
        </Button>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
