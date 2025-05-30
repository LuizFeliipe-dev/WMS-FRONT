
import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Package, Truck, Users, Warehouse } from 'lucide-react';

const StatisticsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <DashboardCard
        title="Total de Itens"
        value="1,243"
        icon={<Package className="h-6 w-6" />}
        to="/items"
        color="blue"
      />
      
      <DashboardCard
        title="Fornecedores"
        value="38"
        icon={<Truck className="h-6 w-6" />}
        to="/suppliers"
        color="green"
      />
      
      <DashboardCard
        title="Armazéns"
        value="5"
        icon={<Warehouse className="h-6 w-6" />}
        to="/warehouses"
        color="amber"
      />
      
      <DashboardCard
        title="Usuários"
        value="17"
        icon={<Users className="h-6 w-6" />}
        to="/users"
        color="purple"
      />
    </div>
  );
};

export default StatisticsCards;
