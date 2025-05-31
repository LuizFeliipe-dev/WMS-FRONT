
import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Package, Truck, Users, Warehouse } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';

const StatisticsCards = () => {
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-xl border bg-white">
            <Skeleton className="h-6 w-6 mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Error loading dashboard data:', error);
  }

  const formatValue = (value: number) => value.toLocaleString('pt-BR');
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <DashboardCard
        title="Cargas Este Mês"
        value={dashboardData ? formatValue(dashboardData.loadsThisMonth) : "0"}
        icon={<Package className="h-6 w-6" />}
        to="/tasks"
        color="default"
      />
      
      <DashboardCard
        title="Fornecedores Ativos"
        value={dashboardData ? formatValue(dashboardData.suppliersThisMonth) : "0"}
        icon={<Truck className="h-6 w-6" />}
        to="/suppliers"
        color="default"
      />
      
      <DashboardCard
        title="Valor Total (Mês)"
        value={dashboardData ? formatCurrency(dashboardData.totalValueThisMonth) : "R$ 0,00"}
        icon={<Warehouse className="h-6 w-6" />}
        to="/balance"
        color="default"
      />
      
      <DashboardCard
        title="Pendente Alocação"
        value={dashboardData ? formatValue(dashboardData.pendingAllocationCount) : "0"}
        icon={<Users className="h-6 w-6" />}
        to="/tasks"
        color="default"
      />
    </div>
  );
};

export default StatisticsCards;
