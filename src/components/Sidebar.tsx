import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Box, 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  Warehouse, 
  LogOut, 
  ArrowRightToLine, 
  Clipboard, 
  BarChart3, 
  Boxes, 
  DollarSign,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Layers,
  LayoutGrid,
  Target,
  Ruler,
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  to: string;
  badge?: string | number;
  permission?: 'initial' | 'second' | 'manager';
}

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  title,
  to,
  badge,
  permission = 'initial'
}: SidebarItemProps) => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const isActive = location.pathname === to;
  
  if (!hasPermission(permission)) return null;
  
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
        "group relative",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="flex-1">{title}</span>
      {badge && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs",
          isActive 
            ? "bg-white/20 text-white" 
            : "bg-primary/10 text-primary"
        )}>
          {badge}
        </span>
      )}
      
      <span className={cn(
        "absolute inset-0 rounded-md transition-opacity",
        "bg-gradient-to-r from-primary/10 to-transparent opacity-0",
        "group-hover:opacity-100",
        isActive && "opacity-0"
      )} />
    </NavLink>
  );
};

const SidebarGroup = ({ title, children, defaultOpen = true }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-sidebar-foreground/70"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      <div className={cn(
        "space-y-1 overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ className }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-background shadow-md lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar p-4",
        "shadow-md border-r border-sidebar-border",
        "transition-transform duration-300 ease-in-out",
        "glass",
        !isOpen && "-translate-x-full",
        "lg:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-8 px-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Box className="h-6 w-6" />
            </div>
            <h1 className="ml-3 text-lg font-semibold">MALLDRE WMS</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1">
            <SidebarItem icon={LayoutDashboard} title="Dashboard" to="/dashboard" />
            
            <SidebarGroup title="Cadastros">
              <SidebarItem icon={Package} title="Itens" to="/items" />
              <SidebarItem icon={Truck} title="Fornecedores" to="/suppliers" />
              <SidebarItem icon={Box} title="Categorias" to="/groups" />
              <SidebarItem icon={Warehouse} title="Armazéns" to="/warehouses" />
              <SidebarItem icon={Users} title="Usuários" to="/users" permission="manager" />
            </SidebarGroup>
            
            <SidebarGroup title="Localizações">
              <SidebarItem icon={Target} title="Zonas" to="/zones" />
              <SidebarItem icon={Ruler} title="Tipos de Prateleiras" to="/shelf-types" />
              <SidebarItem icon={Grid3X3} title="Racks/Prateleiras" to="/racks" />
            </SidebarGroup>
            
            <SidebarGroup title="Eventos">
              <SidebarItem icon={ArrowRightToLine} title="Entrada" to="/entry" />
              <SidebarItem icon={Clipboard} title="Inventário" to="/inventory" />
              <SidebarItem icon={ArrowLeftRight} title="Transação" to="/transaction" />
            </SidebarGroup>
            
            <SidebarGroup title="Exibições">
              <SidebarItem icon={Clipboard} title="Lista de Tarefas" to="/tasks" />
              <SidebarItem icon={BarChart3} title="Estatísticas" to="/statistics" />
              <SidebarItem icon={Boxes} title="Visualização 3D" to="/location-view" />
              <SidebarItem icon={DollarSign} title="Resumo de Saldo" to="/balance" />
            </SidebarGroup>
          </div>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            <div className="px-3 py-2 mb-2">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-sidebar-foreground/70">{user?.email}</div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
