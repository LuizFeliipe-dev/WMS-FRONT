import React from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  Truck,
  ShoppingBag,
  Menu,
  X,
  Warehouse,
  MapPin,
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

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
          name: 'Armazéns',
          href: '/warehouses',
          icon: Warehouse
        },
        {
          name: 'Localizações',
          href: '/locations',
          icon: MapPin
        },
        {
          name: 'Racks',
          href: '/racks',
          icon: Archive
        },
        {
          name: 'Zonas',
          href: '/zones',
          icon: MapPin
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
          name: 'Eventos',
          href: '/events',
          icon: FileText
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
        },
        {
          name: 'Configurações',
          href: '/settings',
          icon: Settings
        }
      ]
    }
  ];

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-gray-50 border-r border-gray-200 shadow-lg">
              <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h1 className="text-lg font-semibold text-gray-900">Painel Administrativo</h1>
                </div>
                
                <nav className="flex-1 px-6 py-4 overflow-y-auto">
                  <div className="space-y-6">
                    {navigationSections.map((section) => (
                      <div key={section.title}>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          {section.title}
                        </h3>
                        <ul className="space-y-1">
                          {section.items.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                  cn(
                                    "flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                                    isActive && "bg-gray-100 font-medium text-gray-900"
                                  )
                                }
                              >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </nav>

                <div className="px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-gray-50 md:border-r md:border-gray-200">
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Painel Administrativo</h1>
        </div>
        
        <nav className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                            isActive && "bg-gray-100 font-medium text-gray-900"
                          )
                        }
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
