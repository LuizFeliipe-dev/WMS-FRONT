
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingBag,
  Archive,
  CheckSquare,
  Scale,
  BookOpen,
  Zap,
  Contact,
} from 'lucide-react';
import { NavigationSection } from '@/types/navigation';

export const navigationSections: NavigationSection[] = [
  {
    title: 'Principal',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        route: 'dashboard/monthly'
      }
    ]
  },
  {
    title: 'Cadastros',
    items: [
      {
        name: 'Usuários',
        href: '/users',
        icon: Users,
        route: 'user'
      },
      {
        name: 'Fornecedores',
        href: '/suppliers',
        icon: Truck,
        route: 'supplier'
      },
      {
        name: 'Contato de Fornecedores',
        href: '/supplier-contacts',
        icon: Contact,
        route: 'supplier/contact'
      },
      {
        name: 'Zonas',
        href: '/zones',
        icon: LayoutDashboard,
        route: 'zone'
      },
      {
        name: 'Categorias de Produtos',
        href: '/groups',
        icon: Package,
        route: 'product/group'
      },
      {
        name: 'Produtos',
        href: '/items',
        icon: ShoppingBag,
        route: 'product'
      },
      {
        name: 'Tipos de Prateleira',
        href: '/shelf-types',
        icon: BookOpen,
        route: 'shelf/type'
      },
      {
        name: 'Racks',
        href: '/racks',
        icon: Archive,
        route: 'rack'
      },
    ]
  },
  {
    title: 'Eventos',
    items: [
      {
        name: 'Entrada',
        href: '/entry',
        icon: CheckSquare,
        route: 'package'
      },
      {
        name: 'Transação',
        href: '/transaction',
        icon: Zap,
        route: 'package'
      },
      {
        name: 'Tarefas',
        href: '/tasks',
        icon: CheckSquare,
        route: 'load'
      },
      {
        name: 'Histórico de Cargas',
        href: '/load-history',
        icon: CheckSquare,
        route: 'load-history'
      }
    ]
  },
  {
    title: 'Gerenciamento',
    items: [
      {
        name: 'Balanço',
        href: '/balance',
        icon: Scale,
        route: 'product'
      }
    ]
  }
];
