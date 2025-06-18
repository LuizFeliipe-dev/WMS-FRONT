
import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Activity, DollarSign } from 'lucide-react';

const QuickLinksSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
      <DashboardCard
        title="Eventos"
        icon={<Activity className="h-6 w-6" />}
        description="Gerenciar entradas, inventário e saídas"
        to="/tasks"
        className="h-full"
      />
      
      <DashboardCard
        title="Balanço"
        icon={<DollarSign className="h-6 w-6" />}
        description="Acompanhar saldo de itens e valores"
        to="/balance"
        className="h-full"
      />
    </div>
  );
};

export default QuickLinksSection;
